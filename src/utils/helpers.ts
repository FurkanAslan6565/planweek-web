import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isYesterday } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Habit, HabitLog, HabitStats } from '../types';

export const formatDate = (date: Date): string => {
  return format(date, 'dd MMMM yyyy', { locale: tr });
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm', { locale: tr });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}s ${mins}dk`;
  }
  return `${mins}dk`;
};

export const getWeekDays = (date: Date = new Date()): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Pazartesi başlangıç
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getDayName = (date: Date): string => {
  return format(date, 'EEEE', { locale: tr });
};

export const getShortDayName = (date: Date): string => {
  return format(date, 'EEE', { locale: tr });
};

export const isCurrentDay = (date: Date): boolean => {
  return isToday(date);
};

export const isPreviousDay = (date: Date): boolean => {
  return isYesterday(date);
};

export const calculateHabitStats = (habit: Habit, logs: HabitLog[]): HabitStats => {
  const habitLogs = logs.filter(log => log.habitId === habit.id);
  const totalCompletions = habitLogs.length;
  
  if (totalCompletions === 0) {
    return {
      totalCompletions: 0,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      averageValue: 0,
      totalTime: 0
    };
  }

  // Calculate streaks
  const sortedLogs = habitLogs.sort((a, b) => b.date.getTime() - a.date.getTime());
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date();
  let currentDate = new Date(today);
  
  // Calculate current streak
  for (let i = 0; i < 365; i++) {
    const dayLogs = sortedLogs.filter(log => isSameDay(log.date, currentDate));
    if (dayLogs.length > 0) {
      currentStreak++;
    } else {
      break;
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  // Calculate longest streak
  for (let i = 0; i < sortedLogs.length; i++) {
    const currentLog = sortedLogs[i];
    const nextLog = sortedLogs[i + 1];
    
    if (nextLog) {
      const daysDiff = Math.floor((currentLog.date.getTime() - nextLog.date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1);
        tempStreak = 0;
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak + 1);
    }
  }
  
  // Calculate completion rate (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentLogs = habitLogs.filter(log => log.date >= thirtyDaysAgo);
  const completionRate = (recentLogs.length / 30) * 100;
  
  // Calculate average value
  const totalValue = habitLogs.reduce((sum, log) => sum + log.completedValue, 0);
  const averageValue = totalValue / totalCompletions;
  
  // Calculate total time (just sum completedValue)
  const totalTime = habitLogs.reduce((sum, log) => sum + log.completedValue, 0);
  
  return {
    totalCompletions,
    currentStreak,
    longestStreak,
    completionRate: Math.round(completionRate * 100) / 100,
    averageValue: Math.round(averageValue * 100) / 100,
    totalTime
  };
};

export const getHabitProgress = (habit: Habit, logs: HabitLog[], date: Date = new Date()): number => {
  const dayLogs = logs.filter(log => 
    log.habitId === habit.id && isSameDay(log.date, date)
  );
  
  if (dayLogs.length === 0) return 0;
  
  const totalCompleted = dayLogs.reduce((sum, log) => sum + log.completedValue, 0);
  return totalCompleted > 0 ? 100 : 0;
};

export const getRandomColor = (): string => {
  const colors = [
    '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336',
    '#00BCD4', '#795548', '#607D8B', '#E91E63', '#FFC107',
    '#8BC34A', '#FF5722', '#3F51B5', '#009688', '#673AB7'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getEmojiIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Sağlık': '🏥',
    'Öğrenme': '📚',
    'Kişisel Gelişim': '🌟',
    'Verimlilik': '⚡',
    'Sosyal': '👥',
    'Spor': '💪',
    'Meditasyon': '🧘',
    'Okuma': '📖',
    'Yazma': '✍️',
    'Müzik': '🎵',
    'Sanat': '🎨',
    'Teknoloji': '💻'
  };
  
  return icons[category] || '📋';
}; 