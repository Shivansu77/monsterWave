import React, { useMemo, useState } from 'react';
import { format, subDays, differenceInCalendarDays, startOfDay } from 'date-fns';

function computeStreak(days, hasValueFn) {
  let current = 0;
  let i = days.length - 1;
  
  // Start from today and count backwards
  while (i >= 0 && hasValueFn(days[i])) {
    current++;
    i--;
  }
  
  // Find longest streak
  let longest = 0;
  let run = 0;
  for (let j = 0; j < days.length; j++) {
    if (hasValueFn(days[j])) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }
  return { current, longest };
}

function computeRate(daysCount, habitId, entriesMap, earliestByHabit) {
  const today = startOfDay(new Date());
  const first = earliestByHabit.get(habitId) || today;
  const availableDays = Math.min(daysCount, Math.max(1, differenceInCalendarDays(today, first) + 1));
  if (availableDays <= 0) return 0;

  let count = 0;
  for (let i = 0; i < availableDays; i++) {
    const d = subDays(today, i);
    const key = `${habitId}:${format(d, 'yyyy-MM-dd')}`;
    if (entriesMap.get(key)) count++;
  }
  return Math.round((count / availableDays) * 100);
}

export default function StatsPanel({ days, habits, entriesMap }) {
  const [viewMode, setViewMode] = useState('streaks');

  const stats = useMemo(() => {
    const earliestByHabit = new Map();
    entriesMap.forEach((_, key) => {
      const [habitId, dateStr] = key.split(':');
      const date = startOfDay(new Date(dateStr));
      const prev = earliestByHabit.get(habitId);
      if (!prev || date < prev) earliestByHabit.set(habitId, date);
    });

    return habits.map(h => {
      const hasValue = (d) => !!entriesMap.get(`${h._id}:${format(d, 'yyyy-MM-dd')}`);
      
      // Generate last 365 days for accurate streak calculation
      const today = new Date();
      const historyDays = [];
      for(let i = 364; i >= 0; i--) historyDays.push(subDays(today, i));
      
      const { current, longest } = computeStreak(historyDays, hasValue);
      
      // Total count
      let total = 0;
      historyDays.forEach(d => {
        if (hasValue(d)) total++;
      });

      // Completion rates
      const weekRate = computeRate(7, h._id, entriesMap, earliestByHabit);
      const monthRate = computeRate(30, h._id, entriesMap, earliestByHabit);
      const yearRate = computeRate(365, h._id, entriesMap, earliestByHabit);
      
      return { 
        id: h._id, 
        name: h.name,
        color: h.color || '#22c55e', 
        current, 
        longest, 
        total, 
        weekRate, 
        monthRate, 
        yearRate 
      };
    });
  }, [habits, entriesMap]);

  return (
    <div className="stats-panel">
      <div className="stats-titles">
        {viewMode === 'streaks' ? (
          <>
            <span>current</span>
            <span>longest</span>
            <span>total</span>
          </>
        ) : (
          <>
            <span>week</span>
            <span>month</span>
            <span>year</span>
          </>
        )}
      </div>
      
      <div className="stats-header">
        <div className="stat-col-head">streak</div>
        <div className="stat-col-head">best</div>
        <div className="stat-col-head">{viewMode === 'streaks' ? 'total' : '%'}</div>
      </div>
      
      {stats.map(s => (
        <div key={s.id} className="stats-row">
          <div className="habit-indicator" style={{ background: s.color }}></div>
          {viewMode === 'streaks' ? (
            <>
              <div className="stat-cell">{s.current}</div>
              <div className="stat-cell">{s.longest}</div>
              <div className="stat-cell">{s.total}</div>
            </>
          ) : (
            <>
              <div className="stat-cell">{s.weekRate}%</div>
              <div className="stat-cell">{s.monthRate}%</div>
              <div className="stat-cell">{s.yearRate}%</div>
            </>
          )}
        </div>
      ))}
      
      <div className="stats-spacer"></div>
      
      <div className="slider-container" onClick={() => setViewMode(v => v === 'streaks' ? 'rates' : 'streaks')}>
        <div className="slider-track">
          <div className="slider-thumb" style={{ 
            left: viewMode === 'streaks' ? '2px' : 'calc(100% - 20px)'
          }}></div>
        </div>
        <div className="slider-labels">
          <span className={viewMode === 'streaks' ? 'active' : ''}>streaks</span>
          <span className={viewMode === 'rates' ? 'active' : ''}>rates</span>
        </div>
      </div>
    </div>
  );
}
