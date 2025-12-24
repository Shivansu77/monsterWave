import React, { useEffect, useMemo, useState } from 'react';
import { addDays, format, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import api from '../api/client.js';
import Topbar from '../components/Topbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import CalendarHeader from '../components/CalendarHeader.jsx';
import HabitGrid from '../components/HabitGrid.jsx';
import StatsPanel from '../components/StatsPanel.jsx';

function daysRange(n, endDate = new Date()) {
  const start = subDays(endDate, n - 1);
  const days = [];
  for (let d = start; d <= endDate; d = addDays(d, 1)) days.push(new Date(d));
  return days;
}

const motivationQuotes = [
  "YOU'VE GOT THIS! 💪",
  "ONE DAY AT A TIME! ⭐",
  "PROGRESS NOT PERFECTION! 🚀",
  "SMALL STEPS, BIG WINS! 🎯",
  "KEEP BUILDING! 🔥",
  "HABITS MAKE HEROES! ⚡",
  "PIXEL BY PIXEL! 🎮",
  "LEVEL UP TODAY! 🏆"
];

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [entries, setEntries] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [groupFilter, setGroupFilter] = useState('all');
  const [showMotivation, setShowMotivation] = useState(true);
  const [currentQuote] = useState(() => motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)]);

  const days = useMemo(() => daysRange(17, endDate), [endDate]);

  const filtered = useMemo(() => {
    if (groupFilter === 'all') return habits;
    return habits.filter(h => h.group === groupFilter);
  }, [habits, groupFilter]);

  const entriesMap = useMemo(() => {
    const m = new Map();
    for (const e of entries) {
      m.set(`${e.habit}:${format(new Date(e.date), 'yyyy-MM-dd')}`, e.value || 1);
    }
    return m;
  }, [entries]);

  const load = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const from = format(subDays(today, 365), 'yyyy-MM-dd');
      const to = format(today, 'yyyy-MM-dd');
      const { data } = await api.get('/api/habits', { params: { from, to } });
      setHabits(data.habits);
      setEntries(data.entries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMotivation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const createHabit = async (name, group) => {
    const { data } = await api.post('/api/habits', { name, group });
    setHabits((h) => [...h, data]);
  };

  const updateHabit = async (id, updates) => {
    setHabits(prev => prev.map(h => h._id === id ? { ...h, ...updates } : h));
    try {
      await api.patch(`/api/habits/${id}`, updates);
    } catch (err) {
      console.error("Failed to update habit", err);
      load();
    }
  };

  const deleteHabit = async (id) => {
    try {
      await api.delete(`/api/habits/${id}`);
      setHabits(prev => prev.filter(h => h._id !== id));
    } catch (err) {
      console.error("Failed to delete habit", err);
    }
  };

  const deleteGroup = (groupName) => {
    const groupHabits = habits.filter(h => h.group === groupName);
    groupHabits.forEach(h => deleteHabit(h._id));
    if (groupFilter === groupName) setGroupFilter('all');
  };

  const toggle = async (habitId, date) => {
    const { data } = await api.post('/api/entries/toggle', { habitId, date });
    setEntries((prev) => {
      const dayKey = `${habitId}:${format(date, 'yyyy-MM-dd')}`;
      const exists = entriesMap.get(dayKey);
      if (exists) return prev.filter((e) => !(e.habit === habitId && format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')));
      return [...prev, { habit: habitId, date, value: 1 }];
    });
  };

  const goToPrevious = () => {
    const newDate = subDays(endDate, 17);
    const oneYearAgo = subDays(new Date(), 365);
    if (newDate >= oneYearAgo) {
      setEndDate(newDate);
    }
  };
  
  const goToNext = () => {
    const newDate = addDays(endDate, 17);
    const today = new Date();
    if (newDate <= today) {
      setEndDate(newDate);
    }
  };
  const goToToday = () => setEndDate(new Date());

  return (
    <div className="layout">
      <Topbar />
      
      {showMotivation && (
        <div className="motivation-popup">
          <div className="motivation-content">
            <Heart size={16} className="motivation-heart" />
            <span>{currentQuote}</span>
            <button className="motivation-close" onClick={() => setShowMotivation(false)}>×</button>
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        <Sidebar habits={habits} onCreate={createHabit} onUpdate={updateHabit} onDelete={deleteHabit} onDeleteGroup={deleteGroup} groupFilter={groupFilter} setGroupFilter={setGroupFilter} />
        
        <div className="main-panel">
          <div className="date-controls">
            <button className="nav-btn" onClick={goToPrevious}>
              <ChevronLeft size={16} />
            </button>
            <button className="nav-btn" onClick={goToNext}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="header-row">
             <CalendarHeader days={days} />
          </div>

          <div className="rows-container">
             {loading ? (
               <div className="muted" style={{ padding: 24 }}>Loading…</div>
             ) : (
               <div className="combined-grid">
                 <HabitGrid days={days} habits={filtered} entriesMap={entriesMap} onToggle={toggle} />
                 <StatsPanel days={days} habits={filtered} entriesMap={entriesMap} />
               </div>
             )}
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-left">
          <span>MonsterWave</span> · <span>Pixel Habits</span> · <span>Mobile Ready</span> · <a href="/features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
        </div>
        <div className="footer-right">
          <span className="green-text">Build better habits! 🚀</span> · <span>support</span> · <span className="muted">MonsterWave 2025</span> · <span className="muted">by shivansubisht</span>
        </div>
      </footer>
    </div>
  );
}
