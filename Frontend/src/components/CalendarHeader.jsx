import React from 'react';
import { format, isToday, isWeekend } from 'date-fns';

export default function CalendarHeader({ days }) {
  return (
    <div className="calendar-header">
      {days.map((d, i) => {
        const isCurrent = isToday(d);
        const weekend = isWeekend(d);
        return (
          <div key={i} className={`col-head ${isCurrent ? 'today' : ''} ${weekend ? 'weekend' : ''}`}>
            <div className="date-top">{format(d, 'MMM')}</div>
            <div className="date-middle">{format(d, 'd')}</div>
            <div className="date-bottom">{format(d, 'EEE').toUpperCase()}</div>
          </div>
        );
      })}
    </div>
  );
}
