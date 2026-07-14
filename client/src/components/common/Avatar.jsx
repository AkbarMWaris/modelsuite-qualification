import { useState } from 'react';
import { getAvatarGradient } from '../../utils/avatarColor';

/**
 * Avatar — renders a user's photo when one is available, and falls back
 * to a colored initials badge whenever there's no photo, or the photo
 * URL fails to load (404, removed file, network error, etc.).
 *
 * This avoids the browser's default broken-image icon entirely: the
 * <img> is only rendered once we know we have a src, and the moment it
 * errors we flip `failed` to true, which unmounts the <img> in favor of
 * the initials — so a bad URL degrades to initials instead of a broken icon.
 */
const Avatar = ({ name = '', src, size = 32, fontSize, className = '', style = {} }) => {
  const [failed, setFailed] = useState(false);
  const initials = name?.trim()?.[0]?.toUpperCase() || '?';
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: fontSize || Math.max(10, Math.round(size * 0.42)),
        fontFamily: 'Inter, sans-serif',
        background: showImage ? undefined : getAvatarGradient(name),
        ...style,
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={name ? `${name}'s avatar` : 'User avatar'}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;