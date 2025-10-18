export interface AnalogyQuestion {
  original_pair: [string, string];
  option_1: [string, string];
  option_2: [string, string];
  option_3: [string, string];
  option_4: [string, string];
  correct_answer: 1 | 2 | 3 | 4;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6;
  explanation: string;
  chat_example: any[];
  item_id: string;
}

export interface QuestionResponse {
  questionId: string;
  selectedAnswer: 1 | 2 | 3 | 4;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  difficulty: number;
  timestamp: number;
}

export interface PracticeSession {
  id: string;
  startTime: number;
  endTime?: number;
  questions: QuestionResponse[];
  currentDifficulty: number;
  sessionLength: number;
  completed: boolean;
}

export interface PerformanceAnalytics {
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  averageAccuracy: number;
  averageTimePerQuestion: number;
  difficultyBreakdown: {
    [key: number]: {
      total: number;
      correct: number;
      averageTime: number;
    };
  };
  recentSessions: PracticeSession[];
  improvementTrend: 'improving' | 'stable' | 'declining';
}

export interface AppState {
  currentSession: PracticeSession | null;
  performanceAnalytics: PerformanceAnalytics | null;
  questionsByDifficulty: {
    [key: number]: AnalogyQuestion[];
  };
  isLoading: boolean;
  error: string | null;
}
