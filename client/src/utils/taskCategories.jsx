/**
 * Single source of truth for task categories — used by CreateTaskModal /
 * EditTaskModal (admin) and AvailableTasksList / TaskCard (talent) so the
 * icon, label, and color for a given category never drift apart.
 */

const IconDesign = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="10" cy="10" r="7" />
    <path d="M10 6.5a3.5 3.5 0 100 7 1.75 1.75 0 000-3.5H9" />
  </svg>
);

const IconDevelopment = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 6L2.5 10 7 14M13 6l4.5 4-4.5 4M11.5 4l-3 12" />
  </svg>
);

const IconWriting = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 17h12M12.5 3.5a1.7 1.7 0 012.4 2.4L6 15l-3.2.7L3.5 12.5z" />
  </svg>
);

const IconVideo = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2.5" y="5" width="10" height="10" rx="2" />
    <path d="M12.5 8.5L17 6v8l-4.5-2.5" />
  </svg>
);

const IconMarketing = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9v2a1 1 0 001 1h1l4 4V4L5 8H4a1 1 0 00-1 1z" />
    <path d="M14 7a3 3 0 010 6M16.5 5a6 6 0 010 10" />
  </svg>
);

const IconOther = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="6" height="6" rx="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1.5" />
  </svg>
);

export const TASK_CATEGORIES = [
  { id: 'Design',      label: 'Design',      color: '#3B82F6', Icon: IconDesign },
  { id: 'Development', label: 'Development', color: '#8B5CF6', Icon: IconDevelopment },
  { id: 'Writing',     label: 'Writing',      color: '#F59E0B', Icon: IconWriting },
  { id: 'Video',       label: 'Video',        color: '#EC4899', Icon: IconVideo },
  { id: 'Marketing',   label: 'Marketing',    color: '#10B981', Icon: IconMarketing },
  { id: 'Other',       label: 'Other',        color: '#64748B', Icon: IconOther },
];

const FALLBACK = TASK_CATEGORIES[TASK_CATEGORIES.length - 1];

export const getCategoryMeta = (id) =>
  TASK_CATEGORIES.find((c) => c.id === id) || FALLBACK;