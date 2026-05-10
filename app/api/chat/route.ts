import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/groq-client';
import { SYSTEM_PROMPT_TUTOR } from '@/lib/prompts';
import type { Message } from '@/lib/types';
import { createTutorResponse } from '@/lib/server/mock';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function buildUsage(messages: Message[], response: string) {
  return {
    promptMessages: messages.length,
    responseCharacters: response.length,
    totalCharacters: messages.reduce((total, message) => total + message.content.length, 0) + response.length,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      messages?: Message[];
      temperature?: number;
      stream?: boolean;
    };

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: 'messages are required' }, { status: 400 });
    }

    const messages = body.messages.slice(-10).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const payloadMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT_TUTOR },
      ...messages,
    ];

    const hasKey = Boolean(process.env.GROQ_API_KEY || process.env['GROQ-API-KEY']);
    const shouldStream = Boolean(body.stream);

    if (!hasKey) {
      const responseText = createTutorResponse(body.messages);
      if (shouldStream) {
        const encoder = new TextEncoder();
        const chunks = responseText.split(' ');
        const stream = new ReadableStream({
          start(controller) {
            for (const chunk of chunks) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: `${chunk} ` } }] })}\n\n`));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        });
      }

      return NextResponse.json({ response: responseText, usage: buildUsage(body.messages, responseText) });
    }

    if (shouldStream) {
      let responseText = '';
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const url = GROQ_URL;
          const groqResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: payloadMessages,
              temperature: body.temperature ?? 0.4,
              stream: true,
            }),
          });

          if (groqResponse.status === 429) {
            controller.enqueue(encoder.encode('data: {"error":"rate_limited"}\n\n'));
            controller.close();
            return;
          }

          if (!groqResponse.ok || !groqResponse.body) {
            controller.error(new Error('Groq request failed'));
            return;
          }

          const reader = groqResponse.body.getReader();
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));
            for (const line of lines) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  responseText += content;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {
                continue;
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const responseText = await chatCompletion([{ role: 'system', content: SYSTEM_PROMPT_TUTOR }, ...payloadMessages.slice(1)], {
      temperature: body.temperature ?? 0.4,
    });

    return NextResponse.json({ response: responseText, usage: buildUsage(body.messages, responseText) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    const status = message.includes('429') || message.toLowerCase().includes('rate') ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
