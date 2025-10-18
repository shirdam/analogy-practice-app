import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../hooks/useTimer';
import { useAdaptivePractice } from '../hooks/useAdaptivePractice';
import { AnalogyQuestion } from '../types';
import AITutor from './AITutor';

interface PracticePageProps {
  questionsByDifficulty: { [key: number]: AnalogyQuestion[] };
  onSessionComplete: (session: any) => void;
}

const PracticePage: React.FC<PracticePageProps> = ({ 
  questionsByDifficulty, 
  onSessionComplete 
}) => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLimit, setTimeLimit] = useState(90); // 1:30 minutes
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  const {
    currentSession,
    currentQuestion,
    selectedAnswer,
    setSelectedAnswer,
    submitAnswer,
    handleTimeout,
    startNewSession,
    endCurrentSession,
    isSessionActive,
    currentQuestionNumber,
    totalQuestionsInSession
  } = useAdaptivePractice({ 
    questionsByDifficulty, 
    onSessionComplete: (session) => {
      onSessionComplete(session);
      navigate('/results');
    }
  });

  const timer = useTimer({
    initialTime: timeLimit,
    onTimeUp: () => {
      if (isSessionActive && currentQuestion) {
        // Handle timeout - submit as wrong answer
        handleTimeout();
      }
    },
    isActive: isSessionActive && timerEnabled,
    onPause: () => console.log('Timer paused'),
    onResume: () => console.log('Timer resumed')
  });

  // Restart timer when a new question loads
  useEffect(() => {
    if (currentQuestion && isSessionActive && timerEnabled) {
      timer.restart();
    }
  }, [currentQuestion, isSessionActive, timerEnabled, timer]);

  const handleStartPractice = () => {
    setShowInstructions(false);
    startNewSession();
  };

  const handleAnswerSelect = (answer: 1 | 2 | 3 | 4) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      submitAnswer();
    }
  };

  const handleEndSession = () => {
    endCurrentSession();
  };

  const handleBackToHome = () => {
    if (isSessionActive) {
      if (window.confirm('האם אתם בטוחים שברצונכם לסיים את התרגול ולחזור לעמוד הבית?')) {
        endCurrentSession();
      }
    } else {
      navigate('/');
    }
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-secondary-800 mb-4">
                הוראות תרגול אנלוגיות
              </h1>
            </div>

            <div className="space-y-6 text-lg text-secondary-700">
              <div className="bg-primary-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-secondary-800 mb-3">
                  מה זה אנלוגיות?
                </h2>
                <p>
                  אנלוגיות הן שאלות הבודקות את יכולתכם לזהות קשרים לוגיים בין זוגות מילים. 
                  בכל שאלה יוצג לכם זוג מילים, ועליכם לבחור את הזוג שמקיים את אותו הקשר הלוגי.
                </p>
              </div>

              <div className="bg-secondary-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-secondary-800 mb-3">
                  איך עובד התרגול?
                </h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>המערכת מתחילה ברמת קושי 3-4 ומתאימה את עצמה בהתאם לביצועים שלכם</li>
                  <li>כל 2 שאלות המערכת מעריכה את הביצועים ומתאימה את רמת הקושי</li>
                  <li>2 תשובות נכונות ברצף מעלות את רמת הקושי, 2 תשובות שגויות ברצף מורידות אותה</li>
                  <li>התרגול מסתיים לאחר 12 שאלות בדיוק</li>
                  <li>לכל שאלה יש מגבלת זמן של 1:30 דקות (ניתן לשנות או לבטל)</li>
                  <li>שאלה שלא נענתה בזמן נחשבת כתשובה שגויה</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-secondary-800 mb-3">
                  טיפים להצלחה
                </h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>קראו בעיון את הזוג המקורי ונסו להבין את הקשר ביניהם</li>
                  <li>חפשו את התשובה שמקיימת את אותו הקשר הלוגי</li>
                  <li>אל תמהרו - השתמשו בכל הזמן הנתון</li>
                  <li>אם אתם לא בטוחים, נסו לשלול תשובות ברור לא נכונות</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleStartPractice}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                התחל תרגול!
              </button>
              <button
                onClick={handleBackToHome}
                className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 text-lg font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                חזור לעמוד הבית
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSessionActive || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-secondary-600">טוען שאלה...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary-800">
                שאלה {currentQuestionNumber} מתוך 12
              </h1>
              <p className="text-secondary-600">
                רמת קושי: {currentSession?.currentDifficulty} | 
                שאלות שהושלמו: {totalQuestionsInSession}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {timerEnabled && (
                <div className={`text-2xl font-mono font-bold px-4 py-2 rounded-lg ${
                  timer.timeLeft < 30 ? 'bg-red-100 text-red-600' : 
                  timer.timeLeft < 60 ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {timer.formattedTime}
                </div>
              )}
              
              <button
                onClick={() => setTimerEnabled(!timerEnabled)}
                className="px-4 py-2 bg-secondary-200 hover:bg-secondary-300 text-secondary-700 rounded-lg transition-colors"
              >
                {timerEnabled ? 'בטל טיימר' : 'הפעל טיימר'}
              </button>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">
              אנלוגיה
            </h2>
            <div className="text-2xl text-primary-600 font-semibold">
              {currentQuestion.original_pair[0]} : {currentQuestion.original_pair[1]}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 1, option: currentQuestion.option_1 },
              { key: 2, option: currentQuestion.option_2 },
              { key: 3, option: currentQuestion.option_3 },
              { key: 4, option: currentQuestion.option_4 }
            ].map(({ key, option }) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key as 1 | 2 | 3 | 4)}
                className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === key
                    ? 'border-primary-500 bg-primary-50 text-primary-800'
                    : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{key}.</span>
                  <span className="text-xl">{option[0]} : {option[1]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Tutor Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsTutorOpen(true)}
            className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">🤖</span>
            <span>שאל את המורה הוירטואלי</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            שלח תשובה
          </button>
          
          <button
            onClick={handleEndSession}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-lg font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            סיים תרגול
          </button>
          
          <button
            onClick={handleBackToHome}
            className="flex-1 bg-secondary-200 hover:bg-secondary-300 text-secondary-800 text-lg font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            חזור לעמוד הבית
          </button>
        </div>

        {/* AI Tutor Modal */}
        <AITutor
          currentQuestion={currentQuestion}
          isOpen={isTutorOpen}
          onClose={() => setIsTutorOpen(false)}
        />
      </div>
    </div>
  );
};

export default PracticePage;
