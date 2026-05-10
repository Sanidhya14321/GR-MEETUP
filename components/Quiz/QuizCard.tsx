import { Card } from '../ui/Card';
import type { Question } from '@/lib/types';

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showResult?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
  questionNumber,
  totalQuestions,
}: QuizCardProps) {
  const isCorrect = showResult && selectedAnswer === question.correctAnswer;
  const hasAnswered = selectedAnswer !== null;
  const correctAnswerLabel = question.options[question.correctAnswer];
  const userAnswerLabel = selectedAnswer === null ? 'Not answered' : question.options[selectedAnswer];

  return (
    <Card className="w-full border border-neutral-200/80 bg-white shadow-sm" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              Question {questionNumber} of {totalQuestions}
            </p>
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">{question.question}</h3>
          </div>
          {showResult ? (
            <div
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                isCorrect ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
              }`}
            >
              {isCorrect ? 'Correct' : 'Incorrect'}
            </div>
          ) : null}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {question.options.map((option, index) => {
            const selected = selectedAnswer === index;
            const correct = showResult && index === question.correctAnswer;
            const incorrect = showResult && selected && index !== question.correctAnswer;
            const indexLabel = String.fromCharCode(65 + index);

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelectAnswer(index)}
                className={`group flex items-start gap-3 rounded-2xl border px-4 py-4 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                  correct
                    ? 'border-success-500 bg-success-50 text-neutral-900 shadow-sm'
                    : incorrect
                      ? 'border-error-500 bg-error-50 text-neutral-900 shadow-sm'
                      : selected
                        ? 'border-neutral-900 bg-neutral-50 shadow-sm ring-1 ring-neutral-900/10'
                        : 'border-neutral-200 bg-white hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-sm'
                }`}
                disabled={showResult}
                aria-pressed={selected}
              >
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${selected || correct ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-neutral-50 text-neutral-500 group-hover:border-neutral-300 group-hover:bg-white'}`}>
                  {indexLabel}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-neutral-900">Option {indexLabel}</span>
                  <span className="mt-1 block leading-6 text-neutral-700">{option}</span>
                </span>
              </button>
            );
          })}
        </div>
        {showResult ? (
          <div className="grid gap-3 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Your answer</p>
              <p className="font-medium text-neutral-900">{hasAnswered ? userAnswerLabel : 'No answer submitted'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Correct answer</p>
              <p className="font-medium text-neutral-900">{correctAnswerLabel}</p>
            </div>
            <div className="md:col-span-2 rounded-xl border border-neutral-200 bg-white p-4 text-neutral-700">
              {question.explanation}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
