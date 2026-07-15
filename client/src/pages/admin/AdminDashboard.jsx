import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Avatar from '../../components/common/Avatar';
import { fetchAllTasks, fetchTalents } from '../../api/tasks';
import { fetchAllSubmissions } from '../../api/submissions';
import { useAuth } from '../../context/AuthContext';

const IconArrow = (props) => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const fmtDate = (raw) => {
  if (!raw) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return raw; }
};

/**
 * A genuine overview — distinct from the /admin/tasks page (which is the
 * full create/search/filter/edit task-management table). This page is a
 * read-only, at-a-glance summary: top-level counters across tasks, talents,
 * and submissions, plus the 5 most recently created tasks with quick links
 * to the pages that let you actually act on them.
 */
const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks]             = useState([]);
  const [talentsCount, setTalentsCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksRes, talentsRes, submissionsRes] = await Promise.all([
          fetchAllTasks(),
          fetchTalents(),
          fetchAllSubmissions(),
        ]);
        setTasks(tasksRes.data);
        setTalentsCount(talentsRes.data.length);
        setPendingReviews(submissionsRes.data.filter((s) => s.reviewStatus === 'Pending').length);
      } catch {
        // Non-fatal — the dashboard just shows zeroes if any of these fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = {
    total:     tasks.length,
    open:      tasks.filter((t) => t.status === 'Open').length,
    submitted: tasks.filter((t) => t.status === 'Submitted').length,
    approved:  tasks.filter((t) => t.status === 'Approved').length,
  };

  const statCards = [
    { label: 'Total Tasks',      value: stats.total,     colorClass: 'stat-card-default', valueColor: 'var(--text-secondary)' },
    { label: 'Open Tasks',       value: stats.open,      colorClass: 'stat-card-blue',    valueColor: '#60A5FA' },
    { label: 'Pending Reviews',  value: pendingReviews,  colorClass: 'stat-card-info',    valueColor: '#60A5FA' },
    { label: 'Active Talents',   value: talentsCount,    colorClass: 'stat-card-green',   valueColor: '#34D399' },
  ];

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <Sidebar />

      <main className="ml-[240px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 240px)' }}>

        {/* Header */}
        <div className="mb-7 page-section">
          <h1 className="font-display text-[22px] font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Here's what's happening across your talent pool right now.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4 mb-6 page-section">
          {statCards.map(({ label, value, colorClass, valueColor }) => (
            <div key={label} className={`stat-card ${colorClass}`}>
              <span className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-3"
                style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                {label}
              </span>
              <span className="block text-[32px] font-bold leading-none"
                style={{ color: valueColor, fontFamily: 'Poppins, sans-serif' }}>
                {loading ? '—' : value}
              </span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-4 mb-6 page-section">
          {[
            { label: 'Manage Tasks',      desc: 'Create, assign, edit, and delete tasks', path: '/admin/tasks' },
            { label: 'Review Submissions', desc: 'Approve or reject talent submissions',   path: '/admin/submissions' },
            { label: 'View Talents',       desc: 'See your talent pool and their workload', path: '/admin/talents' },
          ].map(({ label, desc, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className="surface-elevated rounded-xl px-5 py-4 text-left flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>{label}</p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </div>
              <IconArrow style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* Recent tasks — read-only preview */}
        <div className="tasks-container page-section">
          <div className="table-header-bar">
            <h2 className="text-[15px] font-semibold"
              style={{ color: 'var(--text-secondary)', fontFamily: 'Poppins, sans-serif' }}>
              Recently Created Tasks
            </h2>
            <button onClick={() => navigate('/admin/tasks')}
              className="flex items-center gap-1.5 text-[12.5px] font-semibold cursor-pointer"
              style={{ color: '#60A5FA' }}>
              View all tasks
              <IconArrow />
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="py-16 text-center" style={{ color: 'var(--text-faint)', fontSize: '14px' }}>
              {loading ? 'Loading…' : 'No tasks created yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ fontSize: '13.5px' }}>
                <thead>
                  <tr>
                    <th className="table-th">Title</th>
                    <th className="table-th">Status</th>
                    <th className="table-th">Assigned To</th>
                    <th className="table-th">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task._id} className="table-row">
                      <td className="table-td" style={{ maxWidth: '260px' }}>
                        <span className="block font-semibold truncate"
                          style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                          {task.title || '—'}
                        </span>
                      </td>
                      <td className="table-td">
                        <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11.5px] font-medium ${STATUS_CLASS[task.status] || 'status-badge-Open'}`}>
                          {task.status || '—'}
                        </span>
                      </td>
                      <td className="table-td" style={{ whiteSpace: 'nowrap' }}>
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={task.assignedTo.name} src={task.assignedTo.avatarUrl} size={22} fontSize={10} />
                            <span style={{ color: 'var(--text-secondary)' }}>{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Unassigned</span>
                        )}
                      </td>
                      <td className="table-td" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {fmtDate(task.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;