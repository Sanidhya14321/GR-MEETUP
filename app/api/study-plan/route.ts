import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_STUDY_PLAN } from '@/lib/prompts';
import { createStudyPlan } from '@/lib/server/mock';
import { isDateInFuture, parseDate } from '@/lib/utils/date';

interface StudyPlanRequestBody {
  subject?: string;
  examDate?: string;
  currentLevel?: string;
  hoursPerDay?: number;
  topics?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StudyPlanRequestBody;

    if (!body.subject?.trim()) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 });
    }

    if (!body.examDate || !parseDate(body.examDate) || !isDateInFuture(parseDate(body.examDate) as Date)) {
      return NextResponse.json({ error: 'examDate must be a future date' }, { status: 400 });
    }

    if (!Number.isFinite(body.hoursPerDay) || !body.hoursPerDay || body.hoursPerDay <= 0) {
      return NextResponse.json({ error: 'hoursPerDay must be greater than 0' }, { status: 400 });
    }

    const topics = Array.isArray(body.topics) ? body.topics.filter((topic) => topic.trim()) : [];
    const hasKey = Boolean(process.env.GROQ_API_KEY || process.env['GROQ-API-KEY']);

    if (!hasKey) {
      const plan = createStudyPlan(body.subject, body.examDate, body.currentLevel ?? 'Intermediate', body.hoursPerDay, topics);
      return NextResponse.json({ plan });
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
          { role: 'system', content: SYSTEM_PROMPT_STUDY_PLAN },
          {
            role: 'user',
            content: `Create a study plan for ${body.subject} with exam date ${body.examDate}, current level ${body.currentLevel}, ${body.hoursPerDay} hours per day, and these topics: ${topics.join(', ')}. Return JSON only.`,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (response.status === 429) {
      return NextResponse.json({ error: 'rate limit exceeded' }, { status: 429 });
    }

    if (!response.ok) {
      throw new Error('Study plan generation failed');
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const plan = JSON.parse(data.choices[0]?.message?.content ?? '{}');

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
