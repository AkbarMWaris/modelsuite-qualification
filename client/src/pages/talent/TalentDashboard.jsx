import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';
import { useAuth } from '../../context/AuthContext';

const IconTrophy = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 3h8v4a4 4 0 01-8 0V3z" />
    <path d="M6 4H3.5A1.5 1.5 0 003.5 7H6M14 4h2.5A1.5 1.5 0 0116.5 7H14" />
    <path d="M10 11v3M7 17h6M8 14h4v3H8z" />
  </svg>
);

const IconClock = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 5.5V10l3 2" />
  </svg>
);

const IconTag = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9.5V4a1 1 0 011-1h5.5L17 10.5 10.5 17 3 9.5z" />
    <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const IconArrow = (props) => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

/**
 * "My Tasks" no longer lives on this page — it moved to its own dedicated
 * /talent/tasks page (see MyTasksPage.jsx), reachable from the sidebar.
 * This dashboard still fetches `myTasks` in the background, though: the
 * "My Rewards" stats below are computed from it, they just don't render
 * the task list itself here anymore.
 */
const TalentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks]               = useState([]);
  const [error, setError] = useState(null);

  const loadAvailable = async () => {
    try { const { data } = await fetchAvailableTasks(); setAvailableTasks(data); }
    catch { setError('Failed to load available tasks'); }
  };

  const loadMyTasks = async () => {
    try { const { data } = await fetchMyTasks(); setMyTasks(data); }
    catch { setError('Failed to load your tasks'); }
  };

  // eslint-disable-next-line
  useEffect(() => { loadAvailable(); loadMyTasks(); }, []);
  const handleRefresh = () => { loadAvailable(); loadMyTasks(); };

  // Sum reward points earned/claimed/pending, based on each task's own
  // bounty and current status. A task's points only ever count in exactly
  // one bucket at a time, matching where it currently sits in the workflow:
  //   Claimed (in progress, not yet submitted)  -> "Claimed" — potential reward
  //   Submitted (awaiting admin review)         -> "Pending" — awaiting decision
  //   Approved (admin accepted the submission)  -> "Earned"  — confirmed reward
  const rewards = useMemo(() => {
    return myTasks.reduce(
      (acc, task) => {
        const points = task.bounty || 0;
        if (task.status === 'Claimed')   acc.claimed += points;
        if (task.status === 'Submitted') acc.pending += points;
        if (task.status === 'Approved')  acc.earned  += points;
        return acc;
      },
      { claimed: 0, pending: 0, earned: 0 }
    );
  }, [myTasks]);

  const rewardCards = [
    { label: 'Earned',          value: rewards.earned,  Icon: IconTrophy, colorClass: 'stat-card-green', valueColor: '#34D399', hint: 'From approved tasks' },
    { label: 'Pending Review',  value: rewards.pending, Icon: IconClock,  colorClass: 'stat-card-info',  valueColor: '#60A5FA', hint: 'Awaiting admin decision' },
    { label: 'Claimed Rewards', value: rewards.claimed, Icon: IconTag,    colorClass: 'stat-card-blue',  valueColor: '#60A5FA', hint: 'From tasks in progress' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <TalentSidebar />

      <main className="flex-1 min-w-0 md:ml-[220px] px-4 sm:px-6 md:px-8 pt-20 md:pt-8 pb-8">

        {/* Header */}
        <div className="mb-7 page-section">
          <h1 className="text-[22px] font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Browse available tasks below and claim one to get started.
          </p>
        </div>

        {error && (
          <p className="text-[13px] mb-4 px-4 py-3 rounded-lg"
            style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        {/* My Rewards */}
        <section className="mb-7 page-section">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              My Rewards
            </h2>
            <button onClick={() => navigate('/talent/tasks')}
              className="flex items-center gap-1.5 text-[12px] font-semibold cursor-pointer"
              style={{ color: '#60A5FA' }}>
              View My Tasks
              <IconArrow />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rewardCards.map(({ label, value, Icon, colorClass, valueColor, hint }) => (
              <div key={label} className={`stat-card ${colorClass} flex items-start justify-between gap-3`}>
                <div>
                  <span className="block text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-3"
                    style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                    {label}
                  </span>
                  <span className="block text-[28px] font-bold leading-none"
                    style={{ color: valueColor, fontFamily: 'Poppins, sans-serif' }}>
                    {value} <span className="text-[14px] font-semibold" style={{ color: 'var(--text-faint)' }}>pts</span>
                  </span>
                  <span className="block text-[11px] mt-2" style={{ color: 'var(--text-faint)' }}>{hint}</span>
                </div>
                <Icon width={18} height={18} style={{ color: valueColor, opacity: 0.6, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </section>

        {/* Available Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              Available Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full"
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}>
              {availableTasks.length}
            </span>
          </div>
          <AvailableTasksList tasks={availableTasks} onClaimed={handleRefresh} />
        </section>
      </main>
    </div>
  );
};

export default TalentDashboard;