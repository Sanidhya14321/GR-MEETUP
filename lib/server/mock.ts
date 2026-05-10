import type { Day, Message, Question, StudyPlan, Week } from '@/lib/types';

const MAX_STUDY_PLAN_DAYS = 90;

function getDaysUntilDeadline(examDate: Date): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDeadline = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
  return Math.max(1, Math.ceil((startOfDeadline.getTime() - startOfToday.getTime()) / 86400000));
}

function extractKeywords(text: string, limit = 5): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const frequency = new Map<string, number>();
  for (const word of words) {
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function createTutorResponse(messages: Message[]): string {
  const lastMessage = [...messages].reverse().find((message) => message.role === 'user');
  const topic = lastMessage?.content.trim() || 'the topic';
  const keywords = extractKeywords(topic, 3);

  return [
    `Let us break this down in a clear way.`,
    `The main idea is ${keywords[0] ?? 'to identify the concept'} and connect it to what you already know.`,
    `If you want, I can also give you a shorter version, examples, or a quick practice question.`,
  ].join(' ');
}

export function createQuizQuestions(topic: string, difficulty: 'easy' | 'medium' | 'hard', numQuestions: number): Question[] {
  const keywords = extractKeywords(topic, Math.max(3, numQuestions));
  const difficultyLabel = difficulty === 'easy' ? 'basic' : difficulty === 'medium' ? 'applied' : 'advanced';

  return Array.from({ length: numQuestions }, (_, index) => {
    const keyword = keywords[index % keywords.length] ?? topic;
    const options = [
      `A clear definition of ${keyword}`,
      `A related but incorrect idea about ${keyword}`,
      `A partially correct statement about ${keyword}`,
      `An unrelated statement`,
    ];

    return {
      id: index + 1,
      question: `Which statement best describes ${difficultyLabel} understanding of ${keyword}?`,
      options,
      correctAnswer: 0,
      explanation: `The correct answer focuses on the core idea of ${keyword} and matches the ${difficultyLabel} level requested.`,
    };
  });
}

export function summarizeText(text: string, summaryType: 'brief' | 'detailed' | 'comprehensive'): { summary: string; keyPoints: string[] } {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const keywords = extractKeywords(text, 5);
  const summaryLength = summaryType === 'brief' ? 2 : summaryType === 'detailed' ? 4 : 6;
  const summary = sentences.slice(0, summaryLength).join(' ') || text.slice(0, 400);

  const keyPoints = keywords.map((keyword) => `Focus on ${keyword}.`).slice(0, 5);

  return {
    summary,
    keyPoints: keyPoints.length > 0 ? keyPoints : ['Review the main arguments.', 'Keep only the essential details.'],
  };
}

export function createStudyPlan(
  subject: string,
  examDate: string,
  currentLevel: string,
  hoursPerDay: number,
  topics: string[]
): StudyPlan & { totalDays: number } {
  const start = new Date();
  const end = new Date(examDate);
  const totalDays = Math.min(MAX_STUDY_PLAN_DAYS, getDaysUntilDeadline(end));
  const totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
  const topicPool = topics.length > 0 ? topics : [subject];

  const weeks: Week[] = Array.from({ length: totalWeeks }, (_, weekIndex) => {
    const days: Day[] = Array.from({ length: Math.min(7, totalDays - weekIndex * 7) }, (_, dayIndex) => {
      const globalDay = weekIndex * 7 + dayIndex + 1;
      const topic = topicPool[(globalDay - 1) % topicPool.length];
      const duration = Math.max(45, Math.min(240, hoursPerDay * 60));
      const remainingDays = totalDays - globalDay + 1;
      const intensity = remainingDays <= 7 ? 'Final review' : remainingDays <= 21 ? 'Practice and consolidation' : 'Learning and practice';

      return {
        day: globalDay,
        date: new Date(start.getTime() + (globalDay - 1) * 86400000),
        topics: [topic],
        tasks: [
          `${intensity} for ${topic}`,
          currentLevel.toLowerCase() === 'beginner' ? 'Write short notes' : 'Solve mixed problems',
          remainingDays <= 7 ? 'Complete a short timed recap' : 'Complete targeted practice on the topic',
        ],
        duration,
        completed: false,
      };
    });

    return { weekNumber: weekIndex + 1, days };
  });

  return {
    subject,
    examDate: new Date(examDate),
    weeks,
    tips: [
      'The schedule is capped at 90 days and stops on the exam date.',
      'End each week with one short review block.',
      'Use active recall instead of rereading notes only.',
    ],
    totalDays,
  };
}
