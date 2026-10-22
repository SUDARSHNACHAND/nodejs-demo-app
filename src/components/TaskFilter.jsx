import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function TaskFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  activeCategory,
  setActiveCategory,
}) {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'pending', label: '🔔 Alerts Pending' },
    { id: 'critical', label: '🔥 Critical / High' },
    { id: 'completed', label: '✅ Completed' },
  ];

  const categories = ['All', 'Work', 'Health', 'Coding', 'Personal'];

  return (
    <div className="glass-panel controls-bar" id="tasks-controls-bar">
      <div className="search-input-wrapper">
        <Search className="search-icon-pos" size={18} />
        <input
          type="text"
          placeholder="Search task title or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="task-search-input"
          aria-label="Search daily tasks"
        />
      </div>

      <div className="filter-pills" role="tablist">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`filter-pill ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
            role="tab"
            aria-selected={activeFilter === f.id}
            id={`filter-pill-${f.id}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SlidersHorizontal size={15} color="var(--text-muted)" />
        <select
          className="form-select"
          style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto' }}
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          id="category-filter-select"
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c} style={{ background: '#0f172a', color: '#fff' }}>
              {c === 'All' ? 'All Categories' : c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
