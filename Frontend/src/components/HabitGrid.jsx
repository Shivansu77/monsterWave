import React from 'react';
import DayCell from './DayCell.jsx';
import { format, isWeekend, subDays } from 'date-fns';

function getStreakAtDate(habitId, date, entriesMap) {
  const k = `${habitId}:${format(date, 'yyyy-MM-dd')}`;
  if (!entriesMap.get(k)) return 0;

  let streak = 0;
  let current = new Date(date);
  
  // We already know the current date has a value, so start with 1
  // and look backwards
  while (true) {
    streak++;
    current = subDays(current, 1);
    const key = `${habitId}:${format(current, 'yyyy-MM-dd')}`;
    if (!entriesMap.get(key)) break;
    // Safety break for infinite loops if something goes wrong, though unlikely with date math
    if (streak > 366) break; 
  }
  return streak;
}

export default function HabitGrid({ days, habits, entriesMap, onToggle }) {
  // Calculate totals per day
  const dailyTotals = days.map(d => {
    let sum = 0;
    habits.forEach(h => {
      const k = `${h._id}:${format(d, 'yyyy-MM-dd')}`;
      if (entriesMap.get(k)) sum += entriesMap.get(k);
    });
    return sum;
  });

  return (
    <div className="grid-container">
      {habits.map((h) => (
        <div key={h._id} className="grid-row">
          {days.map((d) => {
            const k = `${h._id}:${format(d, 'yyyy-MM-dd')}`;
            const v = entriesMap.get(k) || 0;
            const weekend = isWeekend(d);
            const streak = v ? getStreakAtDate(h._id, d, entriesMap) : 0;
            
            return (
              <DayCell
                key={k}
                value={v}
                streak={streak}
                onToggle={() => onToggle(h._id, d)}
                color={h.color}
                isWeekend={weekend}
              />
            );
          })}
        </div>
      ))}
      
      {/* Totals Row */}
      <div className="grid-row totals-row">
        {dailyTotals.map((t, i) => (
          <div key={i} className={`total-cell ${isWeekend(days[i]) ? 'weekend' : ''}`}>{t}</div>
        ))}
      </div>
    </div>
  );
}
