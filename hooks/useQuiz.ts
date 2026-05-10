import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Question } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

interface SavedQuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  score: number;
  isComplete: boolean;
}

export function useQuiz() {
  const [savedState, setSavedState] = useLocalStorage<SavedQuizState | null>('quiz-state', null);
  const [questions, setQuestions] = useState<Question[]>(savedState?.questions ?? []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedState?.currentQuestionIndex ?? 0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(savedState?.selectedAnswers ?? []);
  const [score, setScore] = useState(savedState?.score ?? 0);
  const [isComplete, setIsComplete] = useState(savedState?.isComplete ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (savedState) {
      setQuestions(savedState.questions);
      setCurrentQuestionIndex(savedState.currentQuestionIndex);
      setSelectedAnswers(savedState.selectedAnswers);
      setScore(savedState.score);
      setIsComplete(savedState.isComplete);
    }
  }, [savedState]);

  const persist = useCallback((nextState: SavedQuizState | null) => {
    setSavedState(nextState);
  }, [setSavedState]);

  const generateQuiz = useCallback(async (topic: string, difficulty: 'easy' | 'medium' | 'hard', numQuestions: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz.');
      }

      const data = (await response.json()) as { questions: Question[] };
      const nextQuestions = data.questions;
      setQuestions(nextQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswers(Array(nextQuestions.length).fill(null));
      setScore(0);
      setIsComplete(false);
      persist({
        questions: nextQuestions,
        currentQuestionIndex: 0,
        selectedAnswers: Array(nextQuestions.length).fill(null),
        score: 0,
        isComplete: false,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [persist]);

  const selectAnswer = useCallback((answerIndex: number) => {
    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(nextAnswers);
    persist({
      questions,
      currentQuestionIndex,
      selectedAnswers: nextAnswers,
      score,
      isComplete,
    });
  }, [currentQuestionIndex, isComplete, persist, questions, score, selectedAnswers]);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((current) => Math.min(current + 1, questions.length - 1));
  }, [questions.length]);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex((current) => Math.max(current - 1, 0));
  }, []);

  const submitQuiz = useCallback(() => {
    const calculatedScore = questions.reduce((total, question, index) => {
      return total + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    setScore(calculatedScore);
    setIsComplete(true);
    persist({
      questions,
      currentQuestionIndex,
      selectedAnswers,
      score: calculatedScore,
      isComplete: true,
    });
    return calculatedScore;
  }, [currentQuestionIndex, persist, questions, selectedAnswers]);

  const resetQuiz = useCallback(() => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setIsComplete(false);
    setError(null);
    persist(null);
  }, [persist]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex] ?? null, [currentQuestionIndex, questions]);

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    score,
    isComplete,
    isLoading,
    error,
    generateQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
  };
}
