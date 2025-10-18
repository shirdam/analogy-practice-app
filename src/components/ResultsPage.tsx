import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PerformanceAnalytics, PracticeSession } from '../types';

interface ResultsPageProps {
  performanceAnalytics: PerformanceAnalytics | null;
  lastSession: PracticeSession | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ 
  performanceAnalytics, 
  lastSession 
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'order' | 'difficulty' | 'type'>('order');

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleStartNewPractice = () => {
    navigate('/practice');
  };

  if (!performanceAnalytics || !lastSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-800 mb-4">
            אין תוצאות זמינות
          </h1>
          <p className="text-lg text-secondary-600 mb-8">
            עדיין לא ביצעתם תרגול. התחילו תרגול כדי לראות תוצאות!
          </p>
          <button
            onClick={handleStartNewPractice}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            התחל תרגול
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyName = (level: number): string => {
    const names = ['', 'קל', 'קל-בינוני', 'בינוני', 'בינוני-קשה', 'קשה', 'קשה מאוד'];
    return names[level] || `רמה ${level}`;
  };

  const getDifficultyColor = (level: number): string => {
    const colors = ['', 'bg-green-100 text-green-800', 'bg-blue-100 text-blue-800', 
                   'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-800', 
                   'bg-red-100 text-red-800', 'bg-purple-100 text-purple-800'];
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getImprovementTrendText = (trend: string): string => {
    switch (trend) {
      case 'improving': return 'משתפר';
      case 'declining': return 'יורד';
      default: return 'יציב';
    }
  };

  const getImprovementTrendColor = (trend: string): string => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-secondary-800">
              תוצאות התרגול
            </h1>
            <button
              onClick={handleBackToHome}
              className="bg-secondary-200 hover:bg-secondary-300 text-secondary-800 text-lg font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              חזור לעמוד הבית
            </button>
          </div>
        </div>

        {/* Overall Performance Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {performanceAnalytics.totalSessions}
            </div>
            <div className="text-secondary-600">תרגולים</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {performanceAnalytics.totalQuestions}
            </div>
            <div className="text-secondary-600">שאלות</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {performanceAnalytics.averageAccuracy.toFixed(1)}%
            </div>
            <div className="text-secondary-600">דיוק ממוצע</div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {performanceAnalytics.averageTimePerQuestion.toFixed(2)}s
            </div>
            <div className="text-secondary-600">זמן ממוצע לשאלה</div>
          </div>
        </div>

        {/* Last Session Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">
            התרגול האחרון
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {lastSession.questions.length}
              </div>
              <div className="text-secondary-600">שאלות</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {lastSession.questions.filter(q => q.isCorrect).length}
              </div>
              <div className="text-secondary-600">תשובות נכונות</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {lastSession.questions.length > 0 ? 
                  ((lastSession.questions.filter(q => q.isCorrect).length / lastSession.questions.length) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-secondary-600">דיוק</div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('order')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'order' ? 'bg-white shadow-sm' : 'text-secondary-600'
                }`}
              >
                לפי סדר
              </button>
              <button
                onClick={() => setViewMode('difficulty')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'difficulty' ? 'bg-white shadow-sm' : 'text-secondary-600'
                }`}
              >
                לפי רמת קושי
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {viewMode === 'order' ? (
              lastSession.questions.map((question, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className="font-semibold">שאלה {index + 1}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${getDifficultyColor(question.difficulty)}`}>
                      {getDifficultyName(question.difficulty)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTime(question.timeSpent)}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {question.isCorrect ? 'נכון' : 'שגוי'}
                  </div>
                </div>
              ))
            ) : (
              Object.entries(
                lastSession.questions.reduce((acc, question, index) => {
                  if (!acc[question.difficulty]) {
                    acc[question.difficulty] = [];
                  }
                  acc[question.difficulty].push({ ...question, originalIndex: index });
                  return acc;
                }, {} as { [key: number]: any[] })
              ).map(([difficulty, questions]) => (
                <div key={difficulty} className="mb-4">
                  <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                    {getDifficultyName(parseInt(difficulty))} ({questions.length} שאלות)
                  </h3>
                  <div className="space-y-2">
                    {questions.map((question, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <span className="font-semibold">שאלה {question.originalIndex + 1}</span>
                          <span className="text-sm text-gray-500">
                            {formatTime(question.timeSpent)}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {question.isCorrect ? 'נכון' : 'שגוי'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">
            ניתוח ביצועים
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-700 mb-4">
                ביצועים לפי רמת קושי
              </h3>
              <div className="space-y-3">
                {Object.entries(performanceAnalytics.difficultyBreakdown)
                  .filter(([_, data]) => data.total > 0)
                  .map(([difficulty, data]) => (
                    <div key={difficulty} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className={`px-2 py-1 rounded-full text-sm ${getDifficultyColor(parseInt(difficulty))}`}>
                          {getDifficultyName(parseInt(difficulty))}
                        </span>
                        <span className="text-sm text-gray-600">
                          {data.correct}/{data.total}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        {data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-secondary-700 mb-4">
                מגמת שיפור
              </h3>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getImprovementTrendColor(performanceAnalytics.improvementTrend)}`}>
                  {getImprovementTrendText(performanceAnalytics.improvementTrend)}
                </div>
                <p className="text-sm text-gray-600">
                  בהתבסס על 6 התרגולים האחרונים
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleStartNewPractice}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            התחל תרגול חדש
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
