import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_QUIZ } from '@/lib/prompts';
import { createQuizQuestions } from '@/lib/server/mock';

interface QuizRequestBody {
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  numQuestions?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as QuizRequestBody;

    if (!body.topic?.trim()) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    if (!body.difficulty || !['easy', 'medium', 'hard'].includes(body.difficulty)) {
      return NextResponse.json({ error: 'difficulty must be easy, medium, or hard' }, { status: 400 });
    }

    if (!Number.isInteger(body.numQuestions) || !body.numQuestions || body.numQuestions < 3 || body.numQuestions > 20) {
      return NextResponse.json({ error: 'numQuestions must be between 3 and 20' }, { status: 400 });
    }

    const hasKey = Boolean(process.env.GROQ_API_KEY || process.env['GROQ-API-KEY']);

    if (!hasKey) {
      return NextResponse.json({ questions: createQuizQuestions(body.topic, body.difficulty, body.numQuestions) });
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
          { role: 'system', content: SYSTEM_PROMPT_QUIZ },
          {
            role: 'user',
            content: `Create ${body.numQuestions} ${body.difficulty} quiz questions about ${body.topic}. Return JSON only.`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (response.status === 429) {
      return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 });
    }

    if (!response.ok) {
      throw new Error('Quiz generation failed');
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0]?.message?.content ?? '[]';
    const questions = JSON.parse(content) as Array<{ id: number; question: string; options: string[]; correctAnswer: number; explanation: string }>;

    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
