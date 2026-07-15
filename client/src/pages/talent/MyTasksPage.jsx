import { useEffect, useMemo, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import MyTasksList from '../../components/talent/MyTasksList';
import { fetchMyTasks } from '../../api/talent';

const FILTERS = ['All', 'Claimed', 'Submitted', 'Approved', 'Rejected'];

/**
 * A focused, full-page view of everything the logged-in talent has claimed —
 * distinct from /talent/dashboard, which is the marketplace of tasks
 * available to claim plus just a preview of "My Tasks". This page is
 * specifically for managing work already taken on, with status filtering.
 */
const MyTasksPage = () => {
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const loadTasks = async () => {
    try {
      const { data } = await fetchMyTasks();
      setTasks(data);
    } catch {
      alert('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line
  useEffect(() => { loadTasks(); }, []);

  const counts = useMemo(() => {
    const map = { All: tasks.length };
    for (const t of tasks) {
      map[t.status] = (map[t.status] || 0) + 1;
    }
    return map;
  }, [tasks]);

  const filteredTasks = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TalentSidebar />

      <main className="ml-[220px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 220px)' }}>

        {/* Header */}
        <div className="mb-7 page-section">
          <h1 className="text-[22px] font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>
            My Tasks
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Everything you've claimed, submitted, or completed.
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="filter-bar-scroll mb-5 page-section">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-pill ${filter === f ? 'filter-pill-active' : ''}`}
              style={{ '--filter-accent': '#3B82F6' }}>
              {f}
              <span className="filter-pill-count">{counts[f] || 0}</span>
            </button>
          ))}
        </div>

        <div className="page-section">
          {loading ? (
            <div className="py-16 text-center" style={{ color: 'var(--text-faint)', fontSize: '14px' }}>
              Loading your tasks…
            </div>
          ) : (
            <MyTasksList
              tasks={filteredTasks}
              onRefresh={loadTasks}
              emptyMessage={
                filter === 'All'
                  ? "You haven't claimed any tasks yet. Head to your dashboard to find one."
                  : `You have no tasks with status "${filter}".`
              }
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTasksPage;