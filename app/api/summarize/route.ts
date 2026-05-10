import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_SUMMARIZER } from '@/lib/prompts';
import { summarizeText } from '@/lib/server/mock';
import { countWords, estimateReadingTime } from '@/lib/utils/text';

interface SummarizeRequestBody {
  text?: string;
  summaryType?: 'brief' | 'detailed' | 'comprehensive';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SummarizeRequestBody;

    if (!body.text?.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    if (body.text.length > 50000) {
      return NextResponse.json({ error: 'text exceeds 50000 characters' }, { status: 413 });
    }

    const summaryType = body.summaryType ?? 'detailed';
    const hasKey = Boolean(process.env.GROQ_API_KEY || process.env['GROQ-API-KEY']);

    if (!hasKey) {
      const result = summarizeText(body.text, summaryType);
      return NextResponse.json({
        summary: result.summary,
        keyPoints: result.keyPoints,
        wordCount: countWords(body.text),
        readingTime: estimateReadingTime(body.text),
      });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_SUMMARIZER },
          { role: 'user', content: `Create a ${summaryType} summary of the following text:\n\n${body.text}` },
        ],
        temperature: 0.2,
      }),
    });

    if (response.status === 429) {
      return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 });
    }

    if (!response.ok) {
      throw new Error('Summary generation failed');
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const summary = data.choices[0]?.message?.content ?? '';

    return NextResponse.json({
      summary,
      keyPoints: [
        'Review the most important ideas first.',
        'Check for repeated themes and conclusions.',
        'Use the summary as a study outline.',
      ],
      wordCount: countWords(body.text),
      readingTime: estimateReadingTime(body.text),
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
