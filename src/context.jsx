import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USER, MOCK_TASKS, MOCK_NOTIFICATIONS, COMPANION_DATA } from './data';
import robotIdleImg from './assets/robot-idle.jpg';
import robotFocusImg from './assets/robot-focus.jpg';
import robotCelebrateImg from './assets/robot-celebrate.jpg';
import robotBreakImg from './assets/robot-break.jpg';
import logoImg from './assets/logo.jpg';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Single Humanoid Robot Companion
  const [companion, setCompanion] = useState({
    id: 'robot',
    name: 'Aero',
    title: 'Humanoid Cyber-Companion',
    color: 'indigo',
    personality: 'cheerful',
    equippedAccessory: 'headphones',
    equippedColor: '#6366F1',
  });

  // Inventory & Shop
  const [accessoriesShop, setAccessoriesShop] = useState(COMPANION_DATA.accessoriesShop);

  // Desktop Floating/Roaming Companion State
  const [showDesktopCompanion, setShowDesktopCompanion] = useState(true);
  const [isRoaming, setIsRoaming] = useState(true);
  const [companionSpeech, setCompanionSpeech] = useState("Halo User! Aku siap memantau quest belajarmu.");

  // Focus Session state & active timer seconds
  const [focusSession, setFocusSession] = useState(null);
  const [activeFocusSeconds, setActiveFocusSeconds] = useState(1182); // 19:42 default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dndEnabled, setDndEnabled] = useState(true);
  const [lastReward, setLastReward] = useState(null);

  // Return the robot image corresponding to state
  const getCompanionImage = useCallback((state = 'idle') => {
    switch (state) {
      case 'focus':
        return robotFocusImg;
      case 'celebrate':
        return robotCelebrateImg;
      case 'break':
        return robotBreakImg;
      case 'idle':
      default:
        return robotIdleImg;
    }
  }, []);

  // Buy accessory using sparks currency
  const buyAccessory = useCallback((accId) => {
    const item = accessoriesShop.find(a => a.id === accId);
    if (!item) return;

    if (user.sparks < item.cost) {
      alert("Sparks tidak cukup! Selesaikan lebih banyak quest untuk mengumpulkan Sparks.");
      return;
    }

    // Deduct sparks
    setUser(prev => ({
      ...prev,
      sparks: prev.sparks - item.cost,
    }));

    // Mark as owned and equip
    setAccessoriesShop(prev =>
      prev.map(a => (a.id === accId ? { ...a, owned: true } : a))
    );

    setCompanion(prev => ({
      ...prev,
      equippedAccessory: accId,
    }));
  }, [accessoriesShop, user.sparks]);

  // Equip already owned accessory
  const equipAccessory = useCallback((accId) => {
    setCompanion(prev => ({
      ...prev,
      equippedAccessory: accId,
    }));
  }, []);

  const addTask = useCallback((newTask) => {
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const completeQuest = useCallback((taskId, questId, bonusSparks = 0, overtimeMinutes = 0) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const quests = t.quests.map(q =>
        q.id === questId ? { ...q, done: true } : q
      );
      return {
        ...t,
        quests,
        completedQuests: quests.filter(q => q.done).length,
      };
    }));

    // Variable Reward: Base 35 sparks + overtime bonus + lucky mystery drop (10-30 sparks)
    const luckyRoll = Math.floor(Math.random() * 21) + 10; // +10 to +30 extra sparks!
    const totalSparksEarned = 35 + bonusSparks + luckyRoll;
    const mysteryLoots = [
      'Diskon 20% Toko Aksesoris Aero',
      'Token Santai Bebas Cemas (Guilt-Free Pass)',
      'Sertifikat Cicil Tugas Hari Ini Sukses',
      'Booster Fokus Belajar Aero',
    ];
    const dropItem = mysteryLoots[Math.floor(Math.random() * mysteryLoots.length)];

    const rewardData = {
      baseXp: 50,
      baseSparks: 35,
      bonusSparks,
      luckyRoll,
      totalSparks: totalSparksEarned,
      dropItem,
      overtimeMinutes,
    };
    setLastReward(rewardData);

    // Award XP and Sparks (currency)
    setUser(prev => {
      const newXp = prev.xp + 50;
      const isLevelUp = newXp >= prev.xpToNext;
      return {
        ...prev,
        level: isLevelUp ? prev.level + 1 : prev.level,
        xp: isLevelUp ? newXp - prev.xpToNext : newXp,
        xpToNext: isLevelUp ? prev.xpToNext + 100 : prev.xpToNext,
        sparks: (prev.sparks || 180) + totalSparksEarned,
        totalQuests: prev.totalQuests + 1,
        todayCompletedQuests: (prev.todayCompletedQuests ?? 2) + 1,
        todayFocusMinutes: (prev.todayFocusMinutes ?? 70) + 20 + overtimeMinutes,
      };
    });

    return rewardData;
  }, []);

  const getTodayQuests = useCallback(() => {
    const allQuests = [];
    tasks.forEach(task => {
      task.quests.forEach(quest => {
        if (!quest.done) {
          allQuests.push({ ...quest, taskId: task.id, taskName: task.name, course: task.course });
        }
      });
    });
    return allQuests;
  }, [tasks]);

  const getUpcomingDeadlines = useCallback(() => {
    return tasks
      .filter(t => t.completedQuests < t.totalQuests)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [tasks]);

  const value = {
    user, setUser,
    tasks, setTasks, addTask,
    notifications, setNotifications, showNotifications, setShowNotifications,
    companion, setCompanion,
    accessoriesShop, setAccessoriesShop, buyAccessory, equipAccessory,
    showDesktopCompanion, setShowDesktopCompanion,
    isRoaming, setIsRoaming,
    companionSpeech, setCompanionSpeech,
    focusSession, setFocusSession,
    activeFocusSeconds, setActiveFocusSeconds,
    isTimerRunning, setIsTimerRunning,
    dndEnabled, setDndEnabled,
    lastReward, setLastReward,
    getCompanionImage,
    logoImg,
    completeQuest,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
