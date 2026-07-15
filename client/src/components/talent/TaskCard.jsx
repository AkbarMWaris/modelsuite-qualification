import { useState } from 'react';
import { claimTask } from '../../api/talent';
import { getCategoryMeta } from '../../utils/taskCategories';
import TaskDetailModal from './TaskDetailModal';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const IconBounty = (props) => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" />
  </svg>
);

const IconCalendar = (props) => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
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
 * The marketplace card shows a 2-line-clamped preview of the description —
 * that's a deliberate design choice so the grid stays visually uniform, but
 * it means long descriptions get cut off with nothing else visible. Clicking
 * anywhere on the card (other than directly on "Claim Task") opens
 * <TaskDetailModal /> with the complete, untruncated task.
 */
const TaskCard = ({ task, showClaimButton = false, onClaimed }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [claiming, setClaiming]     = useState(false);
  const category = getCategoryMeta(task.category);
  const { Icon: CategoryIcon } = category;

  const handleClaim = async (e) => {
    // Stop the click from also bubbling up to the card and re-opening the modal
    e?.stopPropagation();
    setClaiming(true);
    try {
      await claimTask(task._id);
      setShowDetail(false);
      if (onClaimed) onClaimed();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim task');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      <div
        className="task-marketplace-card"
        style={{ '--card-accent': category.color, cursor: 'pointer' }}
        onClick={() => setShowDetail(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowDetail(true); }}
      >

        {/* Header: category pill + bounty tag */}
        <div className="flex items-center justify-between gap-2">
          <span className="task-category-pill">
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

        {/* Title */}
        <p className="font-display text-[16px] font-semibold leading-snug text-text-primary"
          style={{ fontFamily: 'Poppins, sans-serif' }}>
          {task.title || 'Untitled Task'}
        </p>

        {/* Description — clamped to 2 lines so cards stay uniform in the grid.
           Full text is available in the detail modal opened by clicking the card. */}
        {task.description && (
          <p className="text-[13px] text-text-muted leading-relaxed"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {task.description}
          </p>
        )}

        {/* Status badge, shown only when the card isn't in the claimable marketplace grid */}
        {!showClaimButton && task.status && (
          <span className={`self-start inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-[0.3px] ${STATUS_CLASS[task.status] || ''}`}>
            {task.status}
          </span>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-1">
          <span className="flex items-center gap-1.5 text-[12px] text-text-faint">
            <IconCalendar />
            {task.dueDate ? task.dueDate : 'No due date'}
          </span>
          {task.createdBy?.name && (
            <span className="text-[12px] text-text-faint">By {task.createdBy.name}</span>
          )}
        </div>

        {showClaimButton && (
          <button onClick={handleClaim} className="claim-btn flex items-center justify-center gap-1.5">
            Claim Task
            <IconArrow />
          </button>
        )}
      </div>

      {showDetail && (
        <TaskDetailModal
          task={task}
          showClaimButton={showClaimButton}
          claiming={claiming}
          onClaim={handleClaim}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default TaskCard;