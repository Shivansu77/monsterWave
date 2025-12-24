import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, subYears, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek, getDay, addDays, startOfYear, endOfYear } from 'date-fns';
import { Share, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/client.js';
import Topbar from '../components/Topbar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../detail.css';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getIntensityColor(value, baseColor) {
  if (!value) return 'var(--cell-empty)'; 
  
  const rgb = hexToRgb(baseColor);
  if (!rgb) return baseColor;

  // Opacity-based intensity to match the habit color
  let opacity = 1;
  if (value === 1) opacity = 0.4;
  else if (value === 2) opacity = 0.7;
  else if (value >= 3) opacity = 1;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

export default function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [habit, setHabit] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  // Range: Last 1 year or current year? Screenshot shows Dec to Dec.
  // Let's do last 365 days for a rolling year view.
  const today = new Date();
  const startDate = subYears(addDays(today, offset), 1);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // We need to fetch all habits to find the name/color (or add a specific GET /habits/:id endpoint)
        // For now, let's reuse the list endpoint with a large range.
        // Ideally, we should have a single habit fetch.
        // Let's just fetch the list and filter for now to save backend work, 
        // but we need entries for a whole year.
        
        const from = format(startDate, 'yyyy-MM-dd');
        const to = format(today, 'yyyy-MM-dd');
        
        const { data } = await api.get('/api/habits', { params: { from, to } });
        const found = data.habits.find(h => h._id === id);
        if (!found) {
          navigate('/'); 
          return;
        }
        setHabit(found);
        
        // Filter entries for this habit
        const habitEntries = data.entries.filter(e => e.habit === id);
        setEntries(habitEntries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, token, offset, startDate]);

  const stats = useMemo(() => {
    if (!entries) return { current: 0, longest: 0, total: 0, rate: 0 };
    
    // Map entries to a Set of date strings for O(1) lookup
    const entrySet = new Set(entries.map(e => format(new Date(e.date), 'yyyy-MM-dd')));
    
    // Total
    const total = entrySet.size;
    
    // Rate (based on the 365 days range)
    const rate = Math.round((total / 366) * 100);

    // Streaks
    // Sort dates
    const sortedDates = entries.map(e => new Date(e.date)).sort((a, b) => a - b);
    
    let current = 0;
    let longest = 0;
    let run = 0;
    
    // Check current streak (from today backwards)
    let d = new Date();
    // If today is not done, check yesterday
    if (!entrySet.has(format(d, 'yyyy-MM-dd'))) {
       d = addDays(d, -1);
    }
    
    while (entrySet.has(format(d, 'yyyy-MM-dd'))) {
      current++;
      d = addDays(d, -1);
    }

    // Longest streak calculation
    // We can iterate through the sorted dates
    if (sortedDates.length > 0) {
        let tempRun = 1;
        let maxRun = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const prev = sortedDates[i-1];
            const curr = sortedDates[i];
            const diff = (curr - prev) / (1000 * 60 * 60 * 24);
            
            if (diff === 1) {
                tempRun++;
            } else if (diff > 1) {
                tempRun = 1;
            }
            maxRun = Math.max(maxRun, tempRun);
        }
        longest = maxRun;
    }

    return { current, longest, total, rate };
  }, [entries]);

  const graphData = useMemo(() => {
    // Generate weeks for the graph
    // We want to align by weeks (Sunday start or Monday start).
    // Let's assume Monday start to match screenshot "Mon, Tue..."
    const start = startOfWeek(startDate, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    
    const entryMap = new Map();
    entries.forEach(e => {
      entryMap.set(format(new Date(e.date), 'yyyy-MM-dd'), e.value);
    });

    // Group by weeks
    const weeks = [];
    let currentWeek = [];
    days.forEach(d => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push({
        date: d,
        value: entryMap.get(format(d, 'yyyy-MM-dd')) || 0
      });
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);
    
    return weeks;
  }, [startDate, today, entries]);

  if (loading || !habit) return <div className="layout"><div className="content">Loading...</div></div>;

  return (
    <div className="layout">
      <Topbar />
      <div className="detail-content">
        <div className="detail-header">
          <Link to="/" className="back-link">← Go back</Link>
          <div className="toggle-view">
             {/* Placeholder for the toggle switch in screenshot */}
             <div className="toggle-switch"></div>
          </div>
          <div className="day-scrollers">
            <button onClick={() => setOffset(offset - 1)} className="scroller-btn">
              <ChevronLeft size={20} />
            </button>
            <span className="date-range">{format(startDate, 'MMM dd, yyyy')} - {format(today, 'MMM dd, yyyy')}</span>
            <button onClick={() => setOffset(offset + 1)} className="scroller-btn">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="detail-card">
          <div className="card-top">
            <h1 className="detail-title">{habit.name}</h1>
            <div className="watermark">
              image by <span className="brand-text">everyday-ish</span>
            </div>
          </div>

          <div className="graph-container">
            {/* Months Header */}
            <div className="graph-months">
               {/* Simplified month labels logic */}
               {graphData.filter((_, i) => i % 4 === 0).map((w, i) => (
                 <span key={i} style={{ flex: 1 }}>{format(w[0].date, 'MMM')}</span>
               ))}
            </div>
            
            <div className="graph-body">
              <div className="graph-days">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div className="graph-grid">
                {graphData.map((week, i) => (
                  <div key={i} className="graph-col">
                    {week.map((day, j) => (
                      <div 
                        key={j} 
                        className="graph-cell" 
                        style={{ background: getIntensityColor(day.value, habit.color) }}
                        title={`${format(day.date, 'yyyy-MM-dd')}: ${day.value}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-stats">
            <div className="d-stat">
              <div className="d-val">{stats.current}</div>
              <div className="d-label">CURRENT STREAK</div>
            </div>
            <div className="d-stat">
              <div className="d-val">{stats.longest}</div>
              <div className="d-label">LONGEST STREAK</div>
            </div>
            <div className="d-stat">
              <div className="d-val">{stats.total}</div>
              <div className="d-label">TOTAL COUNT</div>
            </div>
            <div className="d-stat">
              <div className="d-val">{stats.rate}%</div>
              <div className="d-label">COMPLETION RATE</div>
            </div>
          </div>
        </div>

        <div className="detail-footer">
          <span className="link">Download this image</span>
          <div className="share-actions">
            Share: <Share size={16} />
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-left">
          <span>Tips</span> · <span>Web extensions</span> · <span>Devices</span>
        </div>
        <div className="footer-right">
          <span className="green-text">give me feedback please! :-)</span> · <span>contact</span> · <span className="muted">everyday 2025</span> · <span className="muted">by Shivansu Bisht</span>
        </div>
      </footer>
    </div>
  );
}
