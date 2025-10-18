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
    // End session after exactly 12 questions
    return session.sessionLength >= 12;
  }, []);

  const adjustDifficulty = useCallback((session: PracticeSession, lastAnswer: QuestionResponse) => {
    // Adjust difficulty based on the last answer only
    if (lastAnswer.isCorrect && session.currentDifficulty < 6) {
      // Increase difficulty if correct
      setCurrentSession(prev => prev ? { ...prev, currentDifficulty: prev.currentDifficulty + 1 } : null);
    } else if (!lastAnswer.isCorrect && session.currentDifficulty > 1) {
      // Decrease difficulty if wrong
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
      currentDifficulty: 3, // Start with difficulty 3-4 (randomly choose 3 or 4)
      sessionLength: 0,
      completed: false
    };
    
    // Randomly choose between difficulty 3 or 4
    const startingDifficulty = Math.random() < 0.5 ? 3 : 4;
    newSession.currentDifficulty = startingDifficulty;
    
    setCurrentSession(newSession);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUsedQuestions({}); // Reset used questions tracking for new session
    loadNextQuestion(newSession, 0);
  }, [loadNextQuestion]);

  const submitAnswer = useCallback((isTimeout: boolean = false) => {
    if (!currentQuestion || !currentSession) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    // If timeout, treat as wrong answer; otherwise check if selected answer is correct
    const isCorrect = isTimeout ? false : (selectedAnswer === currentQuestion.correct_answer);

    const response: QuestionResponse = {
      questionId: currentQuestion.item_id,
      selectedAnswer: selectedAnswer || 1, // Default to option 1 if timeout
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

    // Adjust difficulty after each answer
    adjustDifficulty(updatedSession, response);

    // Check if session should end (based on difficulty progression)
    if (shouldEndSession(updatedSession)) {
      endSession(updatedSession);
    } else {
      // Load next question
      loadNextQuestion(updatedSession, currentQuestionIndex + 1);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestion, selectedAnswer, currentSession, questionStartTime, currentQuestionIndex, adjustDifficulty, shouldEndSession, endSession, loadNextQuestion]);

  const handleTimeout = useCallback(() => {
    // Submit answer as wrong when time runs out
    submitAnswer(true);
  }, [submitAnswer]);

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
    handleTimeout,
    startNewSession,
    endCurrentSession,
    isSessionActive: currentSession !== null,
    currentQuestionNumber: currentQuestionIndex + 1,
    totalQuestionsInSession: currentSession?.sessionLength || 0
  };
};