import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PerformanceAnalytics } from '../types';

interface HomePageProps {
  performanceAnalytics: PerformanceAnalytics | null;
  totalQuestions?: number;
}

const HomePage: React.FC<HomePageProps> = ({ performanceAnalytics, totalQuestions }) => {
  const navigate = useNavigate();

  const handlePracticeClick = () => {
    navigate('/practice');
  };

  const handleResultsClick = () => {
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-secondary-800 mb-4">
            תרגול אנלוגיות פסיכומטרי
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
            ברוכים הבאים! באפליקציה זו תוכלו לתרגל שאלות אנלוגיות בצורה אדפטיבית, 
            לקבל משוב מיידי ולעקוב אחר ההתקדמות שלכם. המערכת מתאימה את רמת הקושי 
            בהתאם לביצועים שלכם ומספקת חוויית למידה מותאמת אישית.
          </p>
          {totalQuestions && (
            <div className="mt-4 text-lg text-primary-600 font-semibold">
              {totalQuestions} שאלות זמינות לתרגול
            </div>
          )}
        </div>

        {/* Main Action Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-secondary-800 mb-6">
              תרגול אדפטיבי באנלוגיות
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={handlePracticeClick}
                className="w-full max-w-md bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                התחל תרגול!
              </button>
              
              {performanceAnalytics && performanceAnalytics.totalSessions > 0 && (
                <button
                  onClick={handleResultsClick}
                  className="w-full max-w-md bg-secondary-200 hover:bg-secondary-300 text-secondary-800 text-lg font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  הצג תוצאות התרגול האחרון
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                תרגול אדפטיבי
              </h3>
              <p className="text-secondary-600 text-sm">
                המערכת מתאימה את רמת הקושי בהתאם לביצועים שלכם
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                מעקב התקדמות
              </h3>
              <p className="text-secondary-600 text-sm">
                ניתוח מפורט של הביצועים והתקדמות לאורך זמן
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                מורה וירטואלי
              </h3>
              <p className="text-secondary-600 text-sm">
                הדרכה אישית וטיפים לשיפור הביצועים
              </p>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        {performanceAnalytics && performanceAnalytics.totalSessions > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-semibold text-secondary-800 mb-4 text-center">
              סיכום הביצועים שלכם
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600">
                  {performanceAnalytics.totalSessions}
                </div>
                <div className="text-sm text-secondary-600">תרגולים</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">
                  {performanceAnalytics.totalQuestions}
                </div>
                <div className="text-sm text-secondary-600">שאלות</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">
                  {performanceAnalytics.averageAccuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-secondary-600">דיוק ממוצע</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">
                  {performanceAnalytics.averageTimePerQuestion.toFixed(2)}s
                </div>
                <div className="text-sm text-secondary-600">זמן ממוצע</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
