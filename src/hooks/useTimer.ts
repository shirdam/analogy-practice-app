import { useState, useEffect, useRef } from 'react';

interface UseTimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  isActive: boolean;
  onPause?: () => void;
  onResume?: () => void;
  restartKey?: string | number; // Key to force restart when changed
}

export const useTimer = ({ 
  initialTime, 
  onTimeUp, 
  isActive, 
  onPause, 
  onResume,
  restartKey
}: UseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, timeLeft, onTimeUp]);

  // Force restart when initialTime or restartKey changes
  useEffect(() => {
    if (isActive) {
      setTimeLeft(initialTime);
      setIsPaused(false);
    }
  }, [initialTime, isActive, restartKey]);

  const pause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const resume = () => {
    setIsPaused(false);
    onResume?.();
  };

  const reset = (newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
    setIsPaused(false);
  };

  const restart = () => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Reset time and pause state
    setTimeLeft(initialTime);
    setIsPaused(false);
  };

  const addTime = (seconds: number) => {
    setTimeLeft(prev => Math.max(0, prev + seconds));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    isPaused,
    isActive: isActive && !isPaused,
    pause,
    resume,
    reset,
    restart,
    addTime,
    formattedTime: formatTime(timeLeft),
    isTimeUp: timeLeft === 0
  };
};
