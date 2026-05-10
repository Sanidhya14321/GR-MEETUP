'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface StudyDay {
  day: number;
  topics: string[];
  tasks: string[];
  duration: number;
}

interface StudyWeek {
  weekNumber: number;
  days: StudyDay[];
}

interface StudyPlanResponse {
  plan: {
    weeks: StudyWeek[];
    tips: string[];
    totalDays: number;
  };
}

export default function StudyPlanPage() {
  const [subject, setSubject] = useState('Mathematics');
  const [examDate, setExamDate] = useState('');
  const [currentLevel, setCurrentLevel] = useState('Intermediate');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [topics, setTopics] = useState('Algebra, Geometry, Trigonometry');
  const [plan, setPlan] = useState<StudyPlanResponse['plan'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topicList = useMemo(() => topics.split(',').map((topic) => topic.trim()).filter(Boolean), [topics]);

  const handleGenerate = async () => {
    if (!examDate) {
      setError('Choose an exam date.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, examDate, currentLevel, hoursPerDay, topics: topicList }),
      });

      if (!response.ok) {
        throw new Error('Unable to generate the study plan.');
      }

      const data = (await response.json()) as StudyPlanResponse;
      setPlan(data.plan);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Study plan</h1>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">Create a schedule that matches the time available before the exam.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="space-y-5">
            <Input label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
            <Input label="Exam date" type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">Current level</label>
              <select
                className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 shadow-sm outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                value={currentLevel}
                onChange={(event) => setCurrentLevel(event.target.value)}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <Input label="Hours per day" type="number" min={1} max={12} value={hoursPerDay} onChange={(event) => setHoursPerDay(Number(event.target.value))} />
            <Input label="Topics" value={topics} onChange={(event) => setTopics(event.target.value)} helperText="Separate topics with commas." />
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-neutral-500">Plan based on {topicList.length} topics.</p>
              <Button onClick={() => void handleGenerate()} isLoading={isLoading}>
                Generate plan
              </Button>
            </div>
            {error ? <p className="text-sm text-error-600">{error}</p> : null}
            {isLoading ? <div className="flex items-center gap-2 text-sm text-neutral-500"><LoadingSpinner size="sm" /> Building schedule</div> : null}
          </div>
        </Card>

        <Card header={<h2 className="text-lg font-semibold text-neutral-900">Plan</h2>}>
          {plan ? (
            <div className="space-y-6">
              <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                {plan.totalDays} day{plan.totalDays === 1 ? '' : 's'} until the exam
              </div>
              <div className="space-y-4">
                {plan.weeks.map((week) => (
                  <div key={week.weekNumber} className="space-y-3 rounded-3xl border border-neutral-200 p-4">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Week {week.weekNumber}</h3>
                    <div className="grid gap-3">
                      {week.days.map((day) => (
                        <div key={day.day} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-neutral-900">Day {day.day}</p>
                              <p className="mt-1 text-sm text-neutral-600">{day.topics.join(', ')}</p>
                            </div>
                            <p className="text-sm text-neutral-500">{day.duration} min</p>
                          </div>
                          <ul className="mt-3 space-y-1 text-sm text-neutral-500">
                            {day.tasks.map((task) => (
                              <li key={task}>• {task}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Study tips</h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  {plan.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-sm text-neutral-500">
              Generate a plan to see weekly structure and daily tasks.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
