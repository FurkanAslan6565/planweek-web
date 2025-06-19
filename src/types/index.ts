export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: Date;
  weekStartDate: string; // ISO string date, marks the week this habit belongs to
  isActive: boolean;
  reminderTime?: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: Date;
  completedValue: number; // 1 for completed, 0 for not (for now)
  notes?: string;
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TimerSession {
  id: string;
  habitId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  isActive: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  reminderTime: string;
  language: string;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  targetType: 'duration' | 'count';
  targetValue: number;
  unit: string;
  icon: string;
  color: string;
}

export interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  averageValue: number;
  totalTime: number; // minutes
} 