import { getCategoryMeta } from '../../utils/taskCategories';

const IconBounty = (props) => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" />
  </svg>
);

const IconCalendar = (props) => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="14" height="14" rx="2"/>
    <path d="M7 2v4M13 2v4M3 9h14"/>
  </svg>
);

const IconArrow = (props) => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
);

/**
 * Full-detail view of a task, opened by clicking a (necessarily truncated)
 * marketplace <TaskCard />. Nothing here is clamped or truncated — the
 * whole point of this modal is to be the place the complete, untrimmed
 * description actually lives.
 */
const TaskDetailModal = ({ task, showClaimButton = false, onClose, onClaim, claiming }) => {
  const category = getCategoryMeta(task.category);
  const { Icon: CategoryIcon } = category;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[200] p-6"
      onClick={onClose}>
      <div className="bg-bg-card border border-border rounded-xl w-full max-w-lg shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-modal-in max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Accent header */}
        <div style={{ height: '4px', background: category.color }} />

        <div className="p-6">
          {/* Top row: close button */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="task-category-pill" style={{ '--card-accent': category.color }}>
                <CategoryIcon width={12} height={12} />
                {category.label}
              </span>
              {task.bounty > 0 && (
                <span className="task-bounty-tag">
                  <IconBounty />
                  {task.bounty} pts
                </span>
              )}
            </div>
            <button onClick={onClose}
              className="bg-transparent border-none text-text-muted text-base cursor-pointer px-2 py-1 rounded-md hover:bg-bg-hover hover:text-text-primary transition-all shrink-0">
              ✕
            </button>
          </div>

          {/* Title */}
          <h2 className="font-display text-[20px] font-semibold leading-snug text-text-primary mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            {task.title || 'Untitled Task'}
          </h2>

          {/* Full, untruncated description */}
          <p className="text-[14px] leading-relaxed text-text-muted whitespace-pre-wrap mb-5">
            {task.description || 'No description was provided for this task.'}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 flex-wrap pb-5 mb-5 border-b border-border">
            <span className="flex items-center gap-1.5 text-[13px] text-text-faint">
              <IconCalendar />
              {task.dueDate ? `Due ${task.dueDate}` : 'No due date'}
            </span>
            {task.createdBy?.name && (
              <span className="text-[13px] text-text-faint">Posted by {task.createdBy.name}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5">
            <button onClick={onClose}
              className="px-5 py-2.5 bg-bg-input text-text-muted border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-bg-hover hover:text-text-primary transition-all font-sans">
              Close
            </button>
            {showClaimButton && (
              <button
                onClick={onClaim}
                disabled={claiming}
                className="claim-btn flex items-center justify-center gap-1.5 px-5"
                style={{ '--card-accent': category.color, width: 'auto', opacity: claiming ? 0.7 : 1 }}>
                {claiming ? 'Claiming…' : 'Claim Task'}
                {!claiming && <IconArrow />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;