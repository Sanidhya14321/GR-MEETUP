import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT_STUDY_PLAN } from '@/lib/prompts';
import { createStudyPlan } from '@/lib/server/mock';
import { isDateInFuture, parseDate } from '@/lib/utils/date';
import { hasValidGroqApiKey } from '@/lib/groq-client';

const MAX_STUDY_PLAN_DAYS = 90;

function getDaysUntilDeadline(examDate: Date): number {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDeadline = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
  return Math.max(1, Math.ceil((startOfDeadline.getTime() - startOfToday.getTime()) / 86400000));
}

function parseStudyPlanContent(content: string): unknown | null {
  const trimmed = content.trim();
  const unwrapped = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    return JSON.parse(unwrapped);
  } catch {
    try {
      const match = unwrapped.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    } catch {
      return null;
    }
  }
}

interface StudyPlanRequestBody {
  subject?: string;
  examDate?: string;
  currentLevel?: string;
  hoursPerDay?: number;
  topics?: string[];
}

export async function POST(request: NextRequest) {
  let body: StudyPlanRequestBody = {};

  try {
    body = (await request.json()) as StudyPlanRequestBody;

    if (!body.subject?.trim()) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 });
    }

    if (!body.examDate || !parseDate(body.examDate) || !isDateInFuture(parseDate(body.examDate) as Date)) {
      return NextResponse.json({ error: 'examDate must be a future date' }, { status: 400 });
    }

    const examDate = parseDate(body.examDate) as Date;
    if (getDaysUntilDeadline(examDate) > MAX_STUDY_PLAN_DAYS) {
      return NextResponse.json({ error: 'examDate must be within 90 days' }, { status: 400 });
    }

    if (!Number.isFinite(body.hoursPerDay) || !body.hoursPerDay || body.hoursPerDay <= 0) {
      return NextResponse.json({ error: 'hoursPerDay must be greater than 0' }, { status: 400 });
    }

    const topics = Array.isArray(body.topics) ? body.topics.filter((topic) => topic.trim()) : [];
    const hasKey = hasValidGroqApiKey();

    if (!hasKey) {
      const plan = createStudyPlan(body.subject, body.examDate, body.currentLevel ?? 'Intermediate', body.hoursPerDay, topics);
      return NextResponse.json({ plan });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY ?? process.env['GROQ-API-KEY'] ?? ''}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_STUDY_PLAN },
          {
            role: 'user',
            content: `Create a study plan for ${body.subject} with exam date ${body.examDate}, current level ${body.currentLevel}, ${body.hoursPerDay} hours per day, and these topics: ${topics.join(', ')}. Respect the exam deadline and keep the plan within 90 days. Return JSON only.`,
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
    const modelContent = data.choices[0]?.message?.content ?? '';
    const parsedPlan = parseStudyPlanContent(modelContent);

    if (!parsedPlan || typeof parsedPlan !== 'object') {
      const fallbackPlan = createStudyPlan(body.subject, body.examDate, body.currentLevel ?? 'Intermediate', body.hoursPerDay, topics);
      return NextResponse.json({ plan: fallbackPlan });
    }

    return NextResponse.json({ plan: parsedPlan });
  } catch (error) {
    const fallbackTopics = Array.isArray(body.topics) ? body.topics.filter((topic: string) => topic.trim()) : [];
    const fallbackPlan = createStudyPlan(body.subject ?? 'Study', body.examDate ?? new Date().toISOString(), body.currentLevel ?? 'Intermediate', body.hoursPerDay ?? 2, fallbackTopics);
    return NextResponse.json({ plan: fallbackPlan, warning: error instanceof Error ? error.message : 'Unexpected error' });
  }
}
