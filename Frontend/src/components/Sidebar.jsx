import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus, SlidersHorizontal, ChevronDown } from 'lucide-react';

const COLORS = ['#22c55e', '#f97316', '#3b82f6', '#a855f7', '#ef4444', '#eab308' , '#10b981', '#6366f1'];

export default function Sidebar({ habits, onCreate, onUpdate, onDelete, onDeleteGroup, groupFilter, setGroupFilter }) {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroup, setNewGroup] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const groups = useMemo(() => {
    const set = new Set();
    habits.forEach(h => {
      if (h.group) set.add(h.group);
    });
    return Array.from(set).sort();
  }, [habits]);

  const filtered = useMemo(() => {
    if (groupFilter === 'all') return habits;
    return habits.filter(h => h.group === groupFilter);
  }, [habits, groupFilter]);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setIsCreating(false);
      return;
    }
    onCreate(name.trim(), groupFilter === 'all' ? undefined : groupFilter);
    setName('');
    setIsCreating(false);
  };

  const submitGroup = (e) => {
    e.preventDefault();
    const g = newGroup.trim();
    if (!g) {
      setIsAddingGroup(false);
      return;
    }
    setGroupFilter(g);
    setNewGroup('');
    setIsAddingGroup(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!name.trim()) setIsCreating(false);
    }, 100);
  };

  const handleColorClick = (h) => {
    if (!onUpdate) return;
    const idx = COLORS.indexOf(h.color || '#22c55e');
    const nextColor = COLORS[(idx + 1) % COLORS.length];
    onUpdate(h._id, { color: nextColor });
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(habits[index]);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (index) => {
    const draggedOverItem = habits[index];
    if (draggedItem === draggedOverItem) return;
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const draggedOverItem = habits[index];
    if (draggedItem === draggedOverItem) return;
    
    if (onUpdate) {
       const item1 = draggedItem;
       const item2 = draggedOverItem;
       onUpdate(item1._id, { order: item2.order || 0 });
       onUpdate(item2._id, { order: item1.order || 0 });
    }
    setDraggedItem(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="header-left" onClick={() => setIsEditMode(!isEditMode)} title="Toggle Edit Mode">
          <SlidersHorizontal size={20} strokeWidth={2.4} style={{ color: isEditMode ? '#16a34a' : 'var(--muted)' }} />
        </div>

        <div className="header-left" style={{ marginLeft: '12px' }} title="Add group" onClick={() => setIsAddingGroup(true)}>
          <FolderPlus size={22} strokeWidth={2.2} style={{ color: '#16a34a' }} />
        </div>

        <div className="header-right dropdown-anchor" style={{ marginLeft: 'auto' }}>
          <button className="dropdown-trigger" onClick={() => setMenuOpen(o => !o)}>
            {groupFilter === 'all' ? 'ALL HABITS' : String(groupFilter).toUpperCase()} <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu" ref={menuRef}>
              <button className="dropdown-item" onClick={() => { setGroupFilter('all'); setMenuOpen(false); }}>
                <span>All habits</span>
              </button>
              <button className="dropdown-item" onClick={() => { setIsAddingGroup(true); setMenuOpen(false); }}>
                <span>Add group</span>
              </button>
              {groups.length > 0 && <div className="dropdown-sep" />}
              {groups.map((g) => (
                <button
                  key={g}
                  className="dropdown-item"
                  onClick={() => { setGroupFilter(g); setMenuOpen(false); }}
                >
                  <span>{g}</span>
                  {isEditMode && typeof onDeleteGroup === 'function' && (
                    <span
                      className="inline-delete"
                      title="Delete group"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDeleteGroup(g);
                        if (groupFilter === g) setGroupFilter('all');
                        setMenuOpen(false);
                      }}
                    >
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAddingGroup && (
        <div className="new-group-bar">
          <form onSubmit={submitGroup} className="new-group-form">
            <input
              className="new-group-input"
              placeholder="Group name"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              autoFocus
            />
            <button type="submit" className="ghost" style={{ padding: '8px 12px' }}>Save</button>
          </form>
        </div>
      )}

      <div className="group-filter-chips" aria-label="Group filters">
        <button
          className={`chip ${groupFilter === 'all' ? 'active' : ''}`}
          onClick={() => setGroupFilter('all')}
          type="button"
        >
          All
        </button>
        {groups.map(g => (
          <button
            key={g}
            className={`chip ${groupFilter === g ? 'active' : ''}`}
            onClick={() => setGroupFilter(g)}
            type="button"
          >
            {g}
          </button>
        ))}
      </div>
      <ul className="habit-list">
        {filtered.map((h, index) => (
          <li 
            key={h._id} 
            className="habit-item"
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={() => handleDragOver(index)}
            onDrop={(e) => handleDrop(e, index)}
            style={{ opacity: draggedItem === h ? 0.5 : 1, cursor: isEditMode ? 'move' : 'default' }}
          >
            <div className="habit-item-inner">
              {isEditMode && (
                <div className="edit-controls">
                  <button className="edit-btn" title="Delete Habit" onClick={() => onDelete(h._id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                  <button className="edit-btn" title="Change Color" onClick={() => handleColorClick(h)}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: h.color || '#22c55e', border: '1px solid rgba(0,0,0,0.1)' }} />
                  </button>
                  <button className="edit-btn" title="Reorder">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
              <Link to={`/habit/${h._id}`} className="habit-link">
                <span className="habit-dot" style={{ background: h.color || '#22c55e' }} />
                <div className="habit-text">
                  <span>{h.name}</span>
                  {h.group && <small className="habit-group-label">{h.group}</small>}
                </div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="new-habit-container">
        {isCreating ? (
          <form onSubmit={submit} className="new-habit-form">
            <input
              ref={inputRef}
              className="new-habit-input"
              placeholder="Habit name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
            />
          </form>
        ) : (
          <button className="new-habit-btn" onClick={() => setIsCreating(true)}>
            + New Habit
          </button>
        )}
      </div>
    </aside>
  );
}