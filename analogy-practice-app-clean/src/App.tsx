import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PracticePage from './components/PracticePage';
import ResultsPage from './components/ResultsPage';
import { loadQuestionsFromFiles, preprocessQuestionsByDifficulty } from './utils/dataLoader';
import { 
  savePracticeSession, 
  getPerformanceAnalytics, 
  savePerformanceAnalytics, 
  calculatePerformanceAnalytics,
  getLastSession 
} from './utils/storage';
import { AppState, PracticeSession, PerformanceAnalytics } from './types';

function App() {
  const [appState, setAppState] = useState<AppState & { totalQuestions?: number }>({
    currentSession: null,
    performanceAnalytics: null,
    questionsByDifficulty: {},
    isLoading: true,
    error: null,
    totalQuestions: 0
  });

  // Load data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setAppState(prev => ({ ...prev, isLoading: true }));
        
        // Load questions from files
        const questions = await loadQuestionsFromFiles();
        const questionsByDifficulty = preprocessQuestionsByDifficulty(questions);
        
        // Calculate total questions count
        const totalQuestions = questions.length;
        
        // Load performance analytics
        let performanceAnalytics = getPerformanceAnalytics();
        if (!performanceAnalytics) {
          // Initialize with empty analytics if none exist
          performanceAnalytics = {
            totalSessions: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            averageAccuracy: 0,
            averageTimePerQuestion: 0,
            difficultyBreakdown: {},
            recentSessions: [],
            improvementTrend: 'stable'
          };
        }
        
        setAppState({
          currentSession: null,
          performanceAnalytics,
          questionsByDifficulty,
          isLoading: false,
          error: null,
          totalQuestions
        });
      } catch (error) {
        console.error('Error initializing app:', error);
        setAppState(prev => ({
          ...prev,
          isLoading: false,
          error: 'שגיאה בטעינת הנתונים'
        }));
      }
    };

    initializeApp();
  }, []);

  const handleSessionComplete = (session: PracticeSession) => {
    // Save the completed session
    savePracticeSession(session);
    
    // Recalculate performance analytics
    const allSessions = [...(appState.performanceAnalytics?.recentSessions || []), session];
    const updatedAnalytics = calculatePerformanceAnalytics(allSessions);
    
    // Save updated analytics
    savePerformanceAnalytics(updatedAnalytics);
    
    // Update app state
    setAppState(prev => ({
      ...prev,
      performanceAnalytics: updatedAnalytics,
      currentSession: null
    }));
  };

  if (appState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">טוען אפליקציה</h2>
          <p className="text-secondary-600">אנא המתן...</p>
        </div>
      </div>
    );
  }

  if (appState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">שגיאה</h2>
          <p className="text-secondary-600 mb-6">{appState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                performanceAnalytics={appState.performanceAnalytics}
                totalQuestions={appState.totalQuestions}
              />
            } 
          />
          <Route 
            path="/practice" 
            element={
              <PracticePage 
                questionsByDifficulty={appState.questionsByDifficulty}
                onSessionComplete={handleSessionComplete}
              />
            } 
          />
          <Route 
            path="/results" 
            element={
              <ResultsPage 
                performanceAnalytics={appState.performanceAnalytics}
                lastSession={getLastSession()}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
