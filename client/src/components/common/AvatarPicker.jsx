import { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';

const IconCamera = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 6.5a1 1 0 011-1h2l1-1.5h3l1 1.5h2a1 1 0 011 1v7a1 1 0 01-1 1h-9a1 1 0 01-1-1z" />
    <circle cx="10" cy="10" r="2.3" />
  </svg>
);

const IconX = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
);

/**
 * Lets someone pick a profile photo before their account even exists yet
 * (e.g. on the register form). There's no logged-in user or token at this
 * point, so unlike <AvatarUploader />, this never calls the API — it just
 * holds the chosen File in memory and shows a live local preview. The
 * parent (RegisterPage) sends this file along with the rest of the
 * registration form in one request when the user submits.
 *
 * If nothing is ever picked, `file` stays null and <Avatar> falls back to
 * showing initials — exactly as if this component weren't here at all.
 */
const AvatarPicker = ({ name, file, onFileSelect, size = 72 }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Build/revoke a local object URL for whatever file is currently selected
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }
    onFileSelect(selected);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Add a profile photo (optional)"
          className="avatar-uploader"
          style={{ width: size, height: size }}
        >
          <Avatar name={name} src={previewUrl} size={size} fontSize={Math.round(size * 0.38)} />
          <span className="avatar-uploader-badge">
            <IconCamera width={13} height={13} />
          </span>
        </button>

        {file && (
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            title="Remove photo"
            className="avatar-picker-remove"
          >
            <IconX width={9} height={9} />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="file-input-hidden"
        />
      </div>

      <span className="text-[11.5px]" style={{ color: 'var(--text-faint)' }}>
        {file ? 'Photo selected' : 'Add a photo (optional)'}
      </span>
    </div>
  );
};

export default AvatarPicker;