import { PracticeSession, PerformanceAnalytics } from '../types';

const STORAGE_KEYS = {
  PRACTICE_SESSIONS: 'analogy_practice_sessions',
  PERFORMANCE_ANALYTICS: 'analogy_performance_analytics',
  LAST_SESSION: 'analogy_last_session'
};

export const savePracticeSession = (session: PracticeSession): void => {
  try {
    const existingSessions = getPracticeSessions();
    const updatedSessions = [...existingSessions, session];
    localStorage.setItem(STORAGE_KEYS.PRACTICE_SESSIONS, JSON.stringify(updatedSessions));
    localStorage.setItem(STORAGE_KEYS.LAST_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving practice session:', error);
  }
};

export const getPracticeSessions = (): PracticeSession[] => {
  try {
    const sessions = localStorage.getItem(STORAGE_KEYS.PRACTICE_SESSIONS);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error loading practice sessions:', error);
    return [];
  }
};

export const getLastSession = (): PracticeSession | null => {
  try {
    const lastSession = localStorage.getItem(STORAGE_KEYS.LAST_SESSION);
    return lastSession ? JSON.parse(lastSession) : null;
  } catch (error) {
    console.error('Error loading last session:', error);
    return null;
  }
};

export const savePerformanceAnalytics = (analytics: PerformanceAnalytics): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PERFORMANCE_ANALYTICS, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving performance analytics:', error);
  }
};

export const getPerformanceAnalytics = (): PerformanceAnalytics | null => {
  try {
    const analytics = localStorage.getItem(STORAGE_KEYS.PERFORMANCE_ANALYTICS);
    return analytics ? JSON.parse(analytics) : null;
  } catch (error) {
    console.error('Error loading performance analytics:', error);
    return null;
  }
};

export const calculatePerformanceAnalytics = (sessions: PracticeSession[]): PerformanceAnalytics => {
  const totalSessions = sessions.length;
  const totalQuestions = sessions.reduce((sum, session) => sum + session.questions.length, 0);
  const correctAnswers = sessions.reduce((sum, session) => 
    sum + session.questions.filter(q => q.isCorrect).length, 0
  );
  
  const averageAccuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  const totalTime = sessions.reduce((sum, session) => 
    sum + session.questions.reduce((sessionSum, q) => sessionSum + q.timeSpent, 0), 0
  );
  const averageTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : 0;
  
  // Calculate difficulty breakdown
  const difficultyBreakdown: { [key: number]: { total: number; correct: number; averageTime: number } } = {};
  for (let i = 1; i <= 6; i++) {
    difficultyBreakdown[i] = { total: 0, correct: 0, averageTime: 0 };
  }
  
  sessions.forEach(session => {
    session.questions.forEach(question => {
      const diff = question.difficulty;
      difficultyBreakdown[diff].total++;
      if (question.isCorrect) {
        difficultyBreakdown[diff].correct++;
      }
      difficultyBreakdown[diff].averageTime += question.timeSpent;
    });
  });
  
  // Calculate average time per difficulty
  Object.keys(difficultyBreakdown).forEach(difficulty => {
    const level = parseInt(difficulty);
    if (difficultyBreakdown[level].total > 0) {
      difficultyBreakdown[level].averageTime = 
        difficultyBreakdown[level].averageTime / difficultyBreakdown[level].total;
    }
  });
  
  // Calculate improvement trend (simplified - compare last 3 sessions with previous 3)
  let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (sessions.length >= 6) {
    const recentSessions = sessions.slice(-3);
    const previousSessions = sessions.slice(-6, -3);
    
    const recentAccuracy = recentSessions.reduce((sum, session) => {
      const sessionAccuracy = session.questions.length > 0 ? 
        session.questions.filter(q => q.isCorrect).length / session.questions.length : 0;
      return sum + sessionAccuracy;
    }, 0) / recentSessions.length;
    
    const previousAccuracy = previousSessions.reduce((sum, session) => {
      const sessionAccuracy = session.questions.length > 0 ? 
        session.questions.filter(q => q.isCorrect).length / session.questions.length : 0;
      return sum + sessionAccuracy;
    }, 0) / previousSessions.length;
    
    if (recentAccuracy > previousAccuracy + 0.05) {
      improvementTrend = 'improving';
    } else if (recentAccuracy < previousAccuracy - 0.05) {
      improvementTrend = 'declining';
    }
  }
  
  return {
    totalSessions,
    totalQuestions,
    correctAnswers,
    averageAccuracy,
    averageTimePerQuestion,
    difficultyBreakdown,
    recentSessions: sessions.slice(-10), // Last 10 sessions
    improvementTrend
  };
};
