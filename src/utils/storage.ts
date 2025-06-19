import type { Habit, HabitLog, TimerSession, UserSettings } from '../types';
import type { HabitState } from '../contexts/HabitContext';

const STORAGE_KEYS = {
  HABITS: 'habittt_habits',
  HABIT_LOGS: 'habittt_habit_logs',
  TIMER_SESSIONS: 'habittt_timer_sessions',
  USER_SETTINGS: 'habittt_user_settings'
};

const STATE_KEY = 'habittt_state';

export const storage = {
  // Habits
  getHabits: (): Habit[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (!data) return [];
      const habits = JSON.parse(data);
      return habits.map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt)
      }));
    } catch (error) {
      console.error('Error loading habits:', error);
      return [];
    }
  },

  saveHabits: (habits: Habit[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  },

  // Habit Logs
  getHabitLogs: (): HabitLog[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABIT_LOGS);
      if (!data) return [];
      const logs = JSON.parse(data);
      return logs.map((log: any) => ({
        ...log,
        date: new Date(log.date),
        completedAt: new Date(log.completedAt)
      }));
    } catch (error) {
      console.error('Error loading habit logs:', error);
      return [];
    }
  },

  saveHabitLogs: (logs: HabitLog[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving habit logs:', error);
    }
  },

  // Timer Sessions
  getTimerSessions: (): TimerSession[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMER_SESSIONS);
      if (!data) return [];
      const sessions = JSON.parse(data);
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined
      }));
    } catch (error) {
      console.error('Error loading timer sessions:', error);
      return [];
    }
  },

  saveTimerSessions: (sessions: TimerSession[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMER_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving timer sessions:', error);
    }
  },

  // User Settings
  getUserSettings: (): UserSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (!data) {
        return {
          theme: 'light',
          notifications: true,
          reminderTime: '09:00',
          language: 'tr'
        };
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading user settings:', error);
      return {
        theme: 'light',
        notifications: true,
        reminderTime: '09:00',
        language: 'tr'
      };
    }
  },

  saveUserSettings: (settings: UserSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

export const saveState = (state: HabitState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STATE_KEY, serializedState);
  } catch (error) {
    console.error('Could not save state to localStorage', error);
  }
};

export const loadState = (): HabitState | undefined => {
  try {
    const serializedState = localStorage.getItem(STATE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Could not load state from localStorage', error);
    return undefined;
  }
}; 