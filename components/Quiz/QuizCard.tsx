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
  return (
    <Card className="w-full" padding="lg">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-500">
            Question {questionNumber} of {totalQuestions}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">{question.question}</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {question.options.map((option, index) => {
            const selected = selectedAnswer === index;
            const correct = showResult && index === question.correctAnswer;
            const incorrect = showResult && selected && index !== question.correctAnswer;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelectAnswer(index)}
                className={`rounded-2xl border px-4 py-4 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                  correct
                    ? 'border-success-500 bg-success-50 text-neutral-900'
                    : incorrect
                      ? 'border-error-500 bg-error-50 text-neutral-900'
                      : selected
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                }`}
                disabled={showResult}
              >
                <span className="block font-medium text-neutral-900">{String.fromCharCode(65 + index)}</span>
                <span className="mt-1 block text-neutral-700">{option}</span>
              </button>
            );
          })}
        </div>
        {showResult ? <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">{question.explanation}</div> : null}
      </div>
    </Card>
  );
}
