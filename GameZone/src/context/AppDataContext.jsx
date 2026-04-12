/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppDataContext = createContext(null);

const STORAGE_KEY = 'mpg-codeground-app-data';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getStartOfWeek = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  today.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() - diff);
  return today.toISOString().slice(0, 10);
};

const getChallengeForWeek = () => ({
  id: `weekly-${getStartOfWeek()}`,
  title: 'אתגר השבוע',
  description: 'צוברים לפחות 250 נקודות ו־3 סשנים של תרגול במהלך השבוע.',
  goalScore: 250,
  goalSessions: 3,
});

const createSeededUsers = () => [
  {
    id: 'user-aviv',
    name: 'אביב',
    totalScore: 0,
    streakDays: 0,
    longestStreak: 0,
    lastActiveDate: null,
    weeklyScore: 0,
    weeklySessions: 0,
    sessionsCompleted: 0,
    memoryBest: 0,
    typingBestWpm: 0,
  },
  {
    id: 'user-noa',
    name: 'נועה',
    totalScore: 920,
    streakDays: 8,
    longestStreak: 8,
    lastActiveDate: getTodayKey(),
    weeklyScore: 180,
    weeklySessions: 2,
    sessionsCompleted: 18,
    memoryBest: 210,
    typingBestWpm: 24,
  },
  {
    id: 'user-yuval',
    name: 'יובל',
    totalScore: 840,
    streakDays: 6,
    longestStreak: 9,
    lastActiveDate: getTodayKey(),
    weeklyScore: 260,
    weeklySessions: 4,
    sessionsCompleted: 16,
    memoryBest: 180,
    typingBestWpm: 22,
  },
  {
    id: 'user-maya',
    name: 'מאיה',
    totalScore: 760,
    streakDays: 5,
    longestStreak: 7,
    lastActiveDate: getTodayKey(),
    weeklyScore: 220,
    weeklySessions: 3,
    sessionsCompleted: 14,
    memoryBest: 170,
    typingBestWpm: 20,
  },
];

const createInitialData = () => ({
  currentUserId: 'user-aviv',
  users: createSeededUsers(),
  challenge: getChallengeForWeek(),
});

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialData();
    }

    const parsed = JSON.parse(raw);
    return {
      ...createInitialData(),
      ...parsed,
      challenge: getChallengeForWeek(),
    };
  } catch {
    return createInitialData();
  }
};

const updateStreakData = (user, todayKey) => {
  if (!user.lastActiveDate) {
    return { streakDays: 1, longestStreak: Math.max(user.longestStreak, 1), lastActiveDate: todayKey };
  }

  const lastActive = new Date(user.lastActiveDate);
  const today = new Date(todayKey);
  lastActive.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - lastActive.getTime()) / DAY_IN_MS);

  if (diffDays <= 0) {
    return {
      streakDays: user.streakDays || 1,
      longestStreak: Math.max(user.longestStreak || 0, user.streakDays || 1),
      lastActiveDate: todayKey,
    };
  }

  const streakDays = diffDays === 1 ? (user.streakDays || 0) + 1 : 1;

  return {
    streakDays,
    longestStreak: Math.max(user.longestStreak || 0, streakDays),
    lastActiveDate: todayKey,
  };
};

export const AppDataProvider = ({ children }) => {
  const [data, setData] = useState(() => loadData());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const currentUser = useMemo(
    () => data.users.find((user) => user.id === data.currentUserId) ?? data.users[0],
    [data.currentUserId, data.users],
  );

  const leaderboard = useMemo(
    () => [...data.users].sort((a, b) => b.totalScore - a.totalScore),
    [data.users],
  );

  const renameCurrentUser = (name) => {
    setData((current) => ({
      ...current,
      users: current.users.map((user) => (user.id === current.currentUserId ? { ...user, name } : user)),
    }));
  };

  const recordActivity = ({ score = 0, game, memoryBest, typingBestWpm, countSession = true }) => {
    const todayKey = getTodayKey();

    setData((current) => ({
      ...current,
      challenge: getChallengeForWeek(),
      users: current.users.map((user) => {
        if (user.id !== current.currentUserId) {
          return user;
        }

        const streak = updateStreakData(user, todayKey);
        const alreadyCountedToday = user.lastActiveDate === todayKey;

        return {
          ...user,
          ...streak,
          totalScore: user.totalScore + score,
          weeklyScore: user.weeklyScore + score,
          weeklySessions: countSession && !alreadyCountedToday ? user.weeklySessions + 1 : user.weeklySessions,
          sessionsCompleted: countSession ? user.sessionsCompleted + 1 : user.sessionsCompleted,
          memoryBest: game === 'memory' ? Math.max(user.memoryBest, memoryBest ?? score) : user.memoryBest,
          typingBestWpm: game === 'typing' ? Math.max(user.typingBestWpm, typingBestWpm ?? 0) : user.typingBestWpm,
        };
      }),
    }));
  };

  const resetLocalData = () => {
    setData(createInitialData());
  };

  const value = {
    currentUser,
    users: data.users,
    leaderboard,
    challenge: data.challenge,
    renameCurrentUser,
    recordActivity,
    resetLocalData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }

  return context;
};
