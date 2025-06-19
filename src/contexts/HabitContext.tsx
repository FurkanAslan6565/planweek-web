import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Habit, HabitLog, TimerSession } from '../types';
import { loadState, saveState } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export interface HabitState {
  habits: Habit[];
  habitLogs: HabitLog[];
  timerSessions: TimerSession[];
}

type HabitAction =
  | { type: 'ADD_HABIT'; payload: Omit<Habit, 'id' | 'createdAt'> }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_HABIT_LOG'; payload: Omit<HabitLog, 'id'> }
  | { type: 'ADD_TIMER_SESSION'; payload: TimerSession }
  | { type: 'LOAD_STATE'; payload: HabitState };

const habitReducer = (state: HabitState, action: HabitAction): HabitState => {
  switch (action.type) {
    case 'ADD_HABIT':
      const newHabit: Habit = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date(),
      };
      return { ...state, habits: [...state.habits, newHabit] };

    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(h =>
          h.id === action.payload.id ? action.payload : h
        ),
      };

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(h => h.id !== action.payload),
        habitLogs: state.habitLogs.filter(log => log.habitId !== action.payload),
        timerSessions: state.timerSessions.filter(session => session.habitId !== action.payload),
      };

    case 'ADD_HABIT_LOG':
      const newLog: HabitLog = { ...action.payload, id: uuidv4() };
      const existingLogIndex = state.habitLogs.findIndex(
        log => log.habitId === newLog.habitId && new Date(log.date).toDateString() === new Date(newLog.date).toDateString()
      );
      if (existingLogIndex !== -1) {
        return state;
      }
      return { ...state, habitLogs: [...state.habitLogs, newLog] };

    case 'ADD_TIMER_SESSION':
      return { ...state, timerSessions: [...state.timerSessions, action.payload] };
      
    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};

interface HabitContextProps {
  state: HabitState;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  addHabitLog: (log: Omit<HabitLog, 'id'>) => void;
}

const HabitContext = createContext<HabitContextProps | undefined>(undefined);

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState = {
    habits: [],
    habitLogs: [],
    timerSessions: [],
  };

  const [state, dispatch] = useReducer(habitReducer, initialState);
  
  useEffect(() => {
    const loadedState = loadState();
    if (loadedState) {
      const parsedState: HabitState = {
        ...loadedState,
        habits: loadedState.habits.map((h: Habit) => ({ ...h, createdAt: new Date(h.createdAt) })),
        habitLogs: loadedState.habitLogs.map((l: HabitLog) => ({ ...l, date: new Date(l.date) })),
      };
      dispatch({ type: 'LOAD_STATE', payload: parsedState });
    }
  }, []);

  useEffect(() => {
    if (state !== initialState) {
      saveState(state);
    }
  }, [state]);

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt'>) => dispatch({ type: 'ADD_HABIT', payload: habit });
  const updateHabit = (habit: Habit) => dispatch({ type: 'UPDATE_HABIT', payload: habit });
  const deleteHabit = (id: string) => dispatch({ type: 'DELETE_HABIT', payload: id });
  const addHabitLog = (log: Omit<HabitLog, 'id'>) => dispatch({ type: 'ADD_HABIT_LOG', payload: log });

  return (
    <HabitContext.Provider value={{ state, addHabit, updateHabit, deleteHabit, addHabitLog }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitContext = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return context;
}; 