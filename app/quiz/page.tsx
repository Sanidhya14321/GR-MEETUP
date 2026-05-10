'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { QuizCard } from '@/components/Quiz/QuizCard';
import { useQuiz } from '@/hooks/useQuiz';

export default function QuizPage() {
  const { questions, currentQuestion, currentQuestionIndex, selectedAnswers, isLoading, error, generateQuiz, selectAnswer, nextQuestion, previousQuestion, submitQuiz, resetQuiz, isComplete, score } = useQuiz();
  const [topic, setTopic] = useState('Algebra');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, questions.length]);

  const handleGenerate = async () => {
    await generateQuiz(topic, difficulty, numQuestions);
    setSubmittedScore(null);
  };

  const handleSubmit = () => {
    setSubmittedScore(submitQuiz());
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Quiz</h1>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">Generate a focused set of questions and review your answers in one place.</p>
      </div>

      {questions.length === 0 ? (
        <Card>
          <div className="grid gap-6 md:grid-cols-3">
            <Input label="Topic" value={topic} onChange={(event) => setTopic(event.target.value)} />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-900">Difficulty</label>
              <select
                className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 shadow-sm outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as 'easy' | 'medium' | 'hard')}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <Input
              label="Number of questions"
              type="number"
              min={3}
              max={20}
              value={numQuestions}
              onChange={(event) => setNumQuestions(Number(event.target.value))}
            />
          </div>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">Choose a topic and generate a clean practice set.</p>
            <Button onClick={() => void handleGenerate()} isLoading={isLoading}>
              Generate quiz
            </Button>
          </div>
          {error ? <p className="mt-4 text-sm text-error-600">{error}</p> : null}
          {isLoading ? <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500"><LoadingSpinner size="sm" /> Preparing questions</div> : null}
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="overflow-hidden p-0">
            <div className="h-2 bg-neutral-100">
              <div className="h-full bg-[#2f93d1]" style={{ width: `${progress}%` }} />
            </div>
            <div className="p-6">
              {currentQuestion ? (
                <QuizCard
                  question={currentQuestion}
                  selectedAnswer={selectedAnswers[currentQuestionIndex] ?? null}
                  onSelectAnswer={selectAnswer}
                  showResult={isComplete}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />
              ) : null}
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0 || isComplete}>
                Previous
              </Button>
              <Button variant="outline" onClick={nextQuestion} disabled={currentQuestionIndex >= questions.length - 1 || isComplete}>
                Next
              </Button>
            </div>
            {!isComplete ? (
              <Button onClick={handleSubmit}>Submit quiz</Button>
            ) : (
              <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700">
                Score: {submittedScore ?? score}/{questions.length}
              </div>
            )}
          </div>

          {isComplete ? (
            <Card header={<h2 className="text-lg font-semibold text-neutral-900">Review</h2>}>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="rounded-2xl border border-neutral-200 p-4">
                    <p className="text-sm font-medium text-neutral-900">Question {index + 1}</p>
                    <p className="mt-1 text-sm text-neutral-600">{question.question}</p>
                    <p className="mt-2 text-sm text-neutral-500">Correct answer: {question.options[question.correctAnswer]}</p>
                    <p className="mt-2 text-sm text-neutral-500">{question.explanation}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={resetQuiz}>
                  Retry
                </Button>
                <Button onClick={() => void handleGenerate()}>Generate new quiz</Button>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
