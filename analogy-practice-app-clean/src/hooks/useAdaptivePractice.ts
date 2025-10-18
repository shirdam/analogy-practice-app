import { useState, useCallback } from 'react';
import { AnalogyQuestion, PracticeSession, QuestionResponse } from '../types';

interface UseAdaptivePracticeProps {
  questionsByDifficulty: { [key: number]: AnalogyQuestion[] };
  onSessionComplete: (session: PracticeSession) => void;
}

export const useAdaptivePractice = ({ 
  questionsByDifficulty, 
  onSessionComplete 
}: UseAdaptivePracticeProps) => {
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AnalogyQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<1 | 2 | 3 | 4 | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [usedQuestions, setUsedQuestions] = useState<{ [difficulty: number]: Set<string> }>({});

  const endSession = useCallback((session: PracticeSession) => {
    const completedSession: PracticeSession = {
      ...session,
      endTime: Date.now(),
      completed: true
    };
    
    setCurrentSession(null);
    setCurrentQuestion(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    
    onSessionComplete(completedSession);
  }, [onSessionComplete]);

  const shouldEndSession = useCallback((session: PracticeSession): boolean => {
    // End session based on difficulty progression:
    // - If reached difficulty 6 and answered 3+ questions at that level
    // - If completed 15+ questions total
    // - If spent more than 20 minutes (1200 seconds)
    
    const timeSpent = (Date.now() - session.startTime) / 1000;
    const questionsAtMaxDifficulty = session.questions.filter(q => q.difficulty === 6).length;
    
    return (
      session.sessionLength >= 15 ||
      timeSpent >= 1200 ||
      (session.currentDifficulty === 6 && questionsAtMaxDifficulty >= 3)
    );
  }, []);

  const adjustDifficulty = useCallback((session: PracticeSession) => {
    const recentQuestions = session.questions.slice(-3); // Last 3 questions
    const correctCount = recentQuestions.filter(q => q.isCorrect).length;
    
    if (correctCount >= 2 && session.currentDifficulty < 6) {
      // Increase difficulty if 2+ correct out of 3
      setCurrentSession(prev => prev ? { ...prev, currentDifficulty: prev.currentDifficulty + 1 } : null);
    } else if (correctCount <= 1 && session.currentDifficulty > 1) {
      // Decrease difficulty if 1 or fewer correct out of 3
      setCurrentSession(prev => prev ? { ...prev, currentDifficulty: prev.currentDifficulty - 1 } : null);
    }
  }, []);

  const loadNextQuestion = useCallback((session: PracticeSession, questionIndex: number) => {
    const availableQuestions = questionsByDifficulty[session.currentDifficulty];
    const currentDifficulty = session.currentDifficulty;
    
    if (!availableQuestions || availableQuestions.length === 0) {
      // No more questions at current difficulty, try next difficulty
      if (currentDifficulty < 6) {
        const updatedSession = { ...session, currentDifficulty: currentDifficulty + 1 };
        setCurrentSession(updatedSession);
        loadNextQuestion(updatedSession, questionIndex);
        return;
      } else {
        // No more questions available, end session
        endSession(session);
        return;
      }
    }

    // Get used questions for current difficulty level
    const usedQuestionsForLevel = usedQuestions[currentDifficulty] || new Set<string>();
    
    // Filter out already used questions
    const unusedQuestions = availableQuestions.filter(q => !usedQuestionsForLevel.has(q.item_id));
    
    // If all questions have been used at this level, reset the used questions for this level
    if (unusedQuestions.length === 0) {
      setUsedQuestions(prev => ({
        ...prev,
        [currentDifficulty]: new Set<string>()
      }));
      // Try again with all questions available
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
      
      // Mark this question as used
      setUsedQuestions(prev => ({
        ...prev,
        [currentDifficulty]: new Set([...Array.from(usedQuestionsForLevel), question.item_id])
      }));
      
      setCurrentQuestion(question);
      setQuestionStartTime(Date.now());
      setSelectedAnswer(null);
      return;
    }

    // Select a random question from unused questions
    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const question = unusedQuestions[randomIndex];
    
    // Mark this question as used
    setUsedQuestions(prev => ({
      ...prev,
      [currentDifficulty]: new Set([...Array.from(usedQuestionsForLevel), question.item_id])
    }));
    
    setCurrentQuestion(question);
    setQuestionStartTime(Date.now());
    setSelectedAnswer(null);
  }, [questionsByDifficulty, endSession, usedQuestions]);

  const startNewSession = useCallback(() => {
    const sessionId = `session_${Date.now()}`;
    const newSession: PracticeSession = {
      id: sessionId,
      startTime: Date.now(),
      questions: [],
      currentDifficulty: 1, // Start with difficulty 1
      sessionLength: 0,
      completed: false
    };
    
    setCurrentSession(newSession);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUsedQuestions({}); // Reset used questions tracking for new session
    loadNextQuestion(newSession, 0);
  }, [loadNextQuestion]);

  const submitAnswer = useCallback(() => {
    if (!currentQuestion || !selectedAnswer || !currentSession) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    const response: QuestionResponse = {
      questionId: currentQuestion.item_id,
      selectedAnswer,
      isCorrect,
      timeSpent,
      difficulty: currentQuestion.difficulty,
      timestamp: Date.now()
    };

    const updatedSession = {
      ...currentSession,
      questions: [...currentSession.questions, response],
      sessionLength: currentSession.sessionLength + 1
    };

    setCurrentSession(updatedSession);

    // Check if we should adjust difficulty (batched approach - every 3 questions)
    if (updatedSession.questions.length % 3 === 0) {
      adjustDifficulty(updatedSession);
    }

    // Check if session should end (based on difficulty progression)
    if (shouldEndSession(updatedSession)) {
      endSession(updatedSession);
    } else {
      // Load next question
      loadNextQuestion(updatedSession, currentQuestionIndex + 1);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestion, selectedAnswer, currentSession, questionStartTime, currentQuestionIndex, adjustDifficulty, shouldEndSession, endSession, loadNextQuestion]);

  const endCurrentSession = useCallback(() => {
    if (currentSession) {
      endSession(currentSession);
    }
    setUsedQuestions({}); // Reset used questions tracking when session ends
  }, [currentSession, endSession]);

  return {
    currentSession,
    currentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    submitAnswer,
    startNewSession,
    endCurrentSession,
    isSessionActive: currentSession !== null,
    currentQuestionNumber: currentQuestionIndex + 1,
    totalQuestionsInSession: currentSession?.sessionLength || 0
  };
};