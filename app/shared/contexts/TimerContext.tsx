import { FC, ReactNode, useEffect } from "react";
import { useContext } from "react";
import { createContext, useState } from "react";

type TimerContextType = {
  currentTime: number;
  speed: number;
  enabled: boolean;
  setCurrentTime: (time: number) => void;
  setSpeed: (speed: number) => void;
  toggleEnabled: () => void;
};

const defaultState = {
  currentTime: 0,
  speed: 1,
  enabled: true,
  setCurrentTime: (time: number) => {},
  setSpeed: (speed: number) => {},
  toggleEnabled: () => {},
};

export const TimerContext = createContext<TimerContextType>(defaultState);
export const useTimerContext = () => useContext(TimerContext);

let timer: NodeJS.Timer;

export const TimerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(defaultState.enabled);
  const [speed, setSpeed] = useState(defaultState.speed);
  const [currentTime, setCurrentTime] = useState(defaultState.currentTime);

  const toggleEnabled = () => {
    setEnabled(!enabled);
  };

  useEffect(() => {
    clearInterval(timer);
    timer = setInterval(() => {
      if (enabled) {
        setCurrentTime((currentTime) => {
          return currentTime + speed * 100;
        });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [enabled, currentTime, speed]);

  return (
    <TimerContext.Provider
      value={{
        currentTime,
        enabled,
        speed,
        toggleEnabled,
        setSpeed,
        setCurrentTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
