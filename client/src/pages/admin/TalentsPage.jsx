import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Avatar from '../../components/common/Avatar';
import { fetchTalents, fetchAllTasks } from '../../api/tasks';

const TalentsPage = () => {
  const [talents, setTalents] = useState([]);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [talentsRes, tasksRes] = await Promise.all([fetchTalents(), fetchAllTasks()]);
        setTalents(talentsRes.data);
        setTasks(tasksRes.data);
      } catch {
        alert('Failed to load talents');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Group task counts by talent id so each card can show their current workload
  const workloadByTalent = useMemo(() => {
    const map = {};
    for (const task of tasks) {
      const id = task.assignedTo?._id;
      if (!id) continue;
      if (!map[id]) map[id] = { active: 0, submitted: 0, approved: 0 };
      if (task.status === 'Claimed' || task.status === 'Open') map[id].active += 1;
      if (task.status === 'Submitted') map[id].submitted += 1;
      if (task.status === 'Approved') map[id].approved += 1;
    }
    return map;
  }, [tasks]);

  const filteredTalents = talents.filter((t) =>
    !search ||
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-dark)' }}>
      <Sidebar />

      <main className="ml-[240px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 240px)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-7 page-section">
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>
              Talents
            </h1>
            <p className="mt-0.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Everyone in your talent pool, and what they're currently working on.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search talents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-glass"
            style={{ minWidth: '220px', paddingLeft: '14px' }}
          />
        </div>

        {loading ? (
          <div className="py-20 text-center" style={{ color: 'var(--text-faint)', fontSize: '14px' }}>
            Loading talents…
          </div>
        ) : filteredTalents.length === 0 ? (
          <div className="bg-bg-card border border-dashed border-border rounded-xl py-16 text-center text-text-faint text-sm">
            {talents.length === 0 ? 'No talents have registered yet.' : 'No talents match your search.'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 page-section">
            {filteredTalents.map((talent) => {
              const workload = workloadByTalent[talent._id] || { active: 0, submitted: 0, approved: 0 };
              return (
                <div key={talent._id} className="surface-elevated rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={talent.name} src={talent.avatarUrl} size={42} fontSize={15} />
                    <div className="min-w-0">
                      <p className="font-semibold truncate" style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                        {talent.name}
                      </p>
                      <p className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {talent.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-center pt-3">
                      <p className="text-[18px] font-bold" style={{ color: '#60A5FA', fontFamily: 'Poppins, sans-serif' }}>{workload.active}</p>
                      <p className="text-[10.5px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-faint)' }}>Active</p>
                    </div>
                    <div className="text-center pt-3">
                      <p className="text-[18px] font-bold" style={{ color: '#F59E0B', fontFamily: 'Poppins, sans-serif' }}>{workload.submitted}</p>
                      <p className="text-[10.5px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-faint)' }}>Submitted</p>
                    </div>
                    <div className="text-center pt-3">
                      <p className="text-[18px] font-bold" style={{ color: '#34D399', fontFamily: 'Poppins, sans-serif' }}>{workload.approved}</p>
                      <p className="text-[10.5px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-faint)' }}>Approved</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default TalentsPage;