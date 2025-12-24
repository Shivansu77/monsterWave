import React from 'react';
import Topbar from '../components/Topbar.jsx';

export default function FeaturesPage() {
  return (
    <div className="layout">
      <Topbar />
      <div className="features-container" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        
        <div className="features-hero" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', color: 'var(--text)' }}>Features</h1>
          <p style={{ fontSize: '24px', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto' }}>
            Minimalist features to help you do it every day
          </p>
        </div>

        <div className="feature-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
          
          <div className="feature-text" style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
            <div className="feature-icon" style={{ marginBottom: '24px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#4ade80" />
              </svg>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: 'var(--text)' }}>
              At-a-glance progress visualization
            </h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--muted)' }}>
              Easily keep accountable and track your habits and streaks from a simple beautiful board. The more you do, the prettier it looks! As close to a traditional habit tracker on paper as it gets.
            </p>
            <div style={{ width: '40px', height: '4px', background: '#4ade80', marginTop: '30px' }}></div>
          </div>

          <div className="feature-image" style={{ flex: 1.5, minWidth: '500px' }}>
             {/* Mock Board */}
             <div className="mock-board" style={{ background: 'var(--panel)', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--line)' }}>
                <div className="mock-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
                   <div style={{ width: '150px' }}>Habits</div>
                   <div style={{ display: 'flex', gap: '14px' }}>
                      {['Jun 4', 'Jun 5', 'Jun 6', 'Jun 7', 'Jun 8', 'Jun 9', 'Jun 10'].map(d => (
                        <div key={d} style={{ width: '30px', textAlign: 'center' }}>{d.split(' ')[0]}<br/><span style={{color:'var(--text)', fontSize:'14px', fontWeight:'bold'}}>{d.split(' ')[1]}</span></div>
                      ))}
                   </div>
                </div>
                
                {/* Rows */}
                {[
                  { name: 'keep journal', color: '#22c55e', pattern: [1, 2, 3, 1, 0, 3, 3] },
                  { name: 'eat an apple', color: '#84cc16', pattern: [0, 1, 3, 3, 3, 3, 3] },
                  { name: 'floss teeth', color: '#10b981', pattern: [0, 0, 1, 0, 0, 1, 2] },
                  { name: 'eat no sugar', color: '#f97316', pattern: [3, 3, 3, 3, 3, 3, 3] },
                  { name: 'didn\'t smoke', color: '#3b82f6', pattern: [0, 3, 3, 3, 0, 3, 3] },
                  { name: 'yoga exercises', color: '#06b6d4', pattern: [1, 1, 1, 0, 1, 1, 1] },
                  { name: 'wake up 7am', color: '#a855f7', pattern: [2, 2, 2, 2, 2, 2, 3] },
                ].map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', height: '50px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ width: '150px', fontSize: '14px', color: 'var(--text)' }}>{h.name}</div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {h.pattern.map((v, j) => (
                        <div key={j} style={{ 
                          width: '40px', 
                          height: '40px', 
                          background: v === 0 ? 'var(--cell-empty)' : h.color, 
                          opacity: v === 0 ? 1 : (v === 1 ? 0.4 : (v === 2 ? 0.7 : 1)),
                          borderRadius: '2px'
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>

        {/* Customize Board Section */}
        <div className="feature-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap-reverse', background: 'var(--panel)' }}>
          
          <div className="feature-image" style={{ flex: 1.5, minWidth: '500px' }}>
             {/* Mock Reorder List */}
             <div className="mock-list" style={{ background: 'var(--bg)', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--line)', maxWidth: '300px', margin: '0 auto' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', textTransform: 'uppercase' }}>Habits</div>
                {[
                  { name: 'keep journal', color: '#22c55e' },
                  { name: 'eat an apple', color: '#84cc16' },
                  { name: 'eat no sugar', color: '#f97316' },
                  { name: 'floss teeth', color: '#eab308' },
                  { name: 'wake up 7am', color: '#a855f7' },
                  { name: 'go to the gym', color: '#06b6d4', dragging: true },
                  { name: 'write 1000 words', color: '#3b82f6' },
                ].map((h, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px', 
                    background: h.dragging ? 'var(--panel)' : 'transparent',
                    border: h.dragging ? '1px dashed var(--accent)' : 'none',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    opacity: h.dragging ? 0.6 : 1,
                    transform: h.dragging ? 'rotate(2deg)' : 'none'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: h.color, marginRight: '12px' }}></div>
                    <div style={{ fontSize: '14px', color: 'var(--text)' }}>{h.name}</div>
                    {h.dragging && <div style={{ marginLeft: 'auto' }}>✋</div>}
                  </div>
                ))}
             </div>
          </div>

          <div className="feature-text" style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
            <div className="feature-icon" style={{ marginBottom: '24px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" stroke="none" fill="#3b82f6" />
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: 'var(--text)' }}>
              Customize your board
            </h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--muted)' }}>
              Flexibility is important to adapt the tool to your needs. Sorting the habits, you can prioritize them or group them in categories. Colours can not only be used to make your board look prettier to you, but also to group your habits by type. With the 'break habit' option, have chains with descending colours for habits you want to break.
            </p>
            <div style={{ width: '40px', height: '4px', background: '#3b82f6', marginTop: '30px' }}></div>
          </div>

        </div>
      </div>
    </div>
  );
}
