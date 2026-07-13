import { useId } from 'react';
import { useTheme } from '../../context/ThemeContext';


const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const maskId = `crescent-mask-${useId()}`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`theme-toggle ${className}`}
      data-state={theme}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-stars">
          <span className="star star-1" />
          <span className="star star-2" />
          <span className="star star-3" />
        </span>

        <span className="theme-toggle-thumb">
          <svg viewBox="0 0 24 24" width="14" height="14" className="theme-toggle-icon">
            {/* Rays — visible in light mode, fade out for dark */}
            <g className="sun-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1"  x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
              <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
              <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
            </g>
            {/* Body — a circle whose visible area is carved into a crescent
               by an overlapping mask circle that slides in for dark mode */}
            <mask id={maskId}>
              <rect x="0" y="0" width="24" height="24" fill="white" />
              <circle className="crescent-cutout" cx="12" cy="12" r="7" fill="black" />
            </mask>
            <circle cx="12" cy="12" r="6" fill="currentColor" mask={`url(#${maskId})`} />
          </svg>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;