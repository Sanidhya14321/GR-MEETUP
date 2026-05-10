export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdAt: Date;
}

export interface Day {
  day: number;
  date: Date;
  topics: string[];
  tasks: string[];
  duration: number;
  completed: boolean;
}

export interface Week {
  weekNumber: number;
  days: Day[];
}

export interface StudyPlan {
  subject: string;
  examDate: Date;
  weeks: Week[];
  tips: string[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  score: number;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiError {
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}
