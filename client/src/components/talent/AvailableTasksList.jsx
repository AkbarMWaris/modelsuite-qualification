import { useMemo, useState } from 'react';
import TaskCard from './TaskCard';
import { TASK_CATEGORIES, getCategoryMeta } from '../../utils/taskCategories';

const IconGrid = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.3" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.3" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.3" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.3" />
  </svg>
);

const AvailableTasksList = ({ tasks, onClaimed }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const counts = useMemo(() => {
    const map = {};
    for (const t of tasks || []) {
      const id = getCategoryMeta(t.category).id;
      map[id] = (map[id] || 0) + 1;
    }
    return map;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeCategory === 'All') return tasks || [];
    return (tasks || []).filter((t) => getCategoryMeta(t.category).id === activeCategory);
  }, [tasks, activeCategory]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-bg-card border border-dashed border-border rounded-xl py-10 px-6 text-center text-text-faint text-sm">
        No open tasks right now — check back later!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Category filter bar */}
      <div className="filter-bar-scroll">
        <button
          onClick={() => setActiveCategory('All')}
          className={`filter-pill ${activeCategory === 'All' ? 'filter-pill-active' : ''}`}
          style={{ '--filter-accent': '#3B82F6' }}>
          <IconGrid width={13} height={13} />
          All
          <span className="filter-pill-count">{tasks.length}</span>
        </button>

        {TASK_CATEGORIES.filter((c) => counts[c.id]).map(({ id, label, color, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`filter-pill ${activeCategory === id ? 'filter-pill-active' : ''}`}
            style={{ '--filter-accent': color }}>
            <Icon width={13} height={13} />
            {label}
            <span className="filter-pill-count">{counts[id]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-bg-card border border-dashed border-border rounded-xl py-10 px-6 text-center text-text-faint text-sm">
          No tasks in this category right now.
        </div>
      ) : (
        <div className="marketplace-grid">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} showClaimButton onClaimed={onClaimed} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableTasksList;