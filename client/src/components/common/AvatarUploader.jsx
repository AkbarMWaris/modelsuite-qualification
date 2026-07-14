import { useRef, useState } from 'react';
import Avatar from './Avatar';
import { uploadAvatar } from '../../api/profile';
import { useAuth } from '../../context/AuthContext';

const IconCamera = (props) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 6.5a1 1 0 011-1h2l1-1.5h3l1 1.5h2a1 1 0 011 1v7a1 1 0 01-1 1h-9a1 1 0 01-1-1z" />
    <circle cx="10" cy="10" r="2.3" />
  </svg>
);

/**
 * A clickable avatar for the *currently logged-in* user only — clicking it
 * opens a file picker and immediately uploads the chosen image, then
 * updates the avatar everywhere in the app via AuthContext.
 *
 * For showing *other* people's avatars (assigned talent, submission owner,
 * etc.) use the plain read-only <Avatar /> instead — this component is
 * specifically for "change my own photo".
 */
const AvatarUploader = ({ size = 32 }) => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // reset so choosing the same file again still fires onChange
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }

    setUploading(true);
    try {
      const { data } = await uploadAvatar(file);
      updateUser({ avatarUrl: data.avatarUrl });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      title="Change profile photo"
      className="avatar-uploader"
      style={{ width: size, height: size }}
    >
      <Avatar name={user?.name} src={user?.avatarUrl} size={size} />

      <span className="avatar-uploader-badge">
        {uploading ? <span className="avatar-uploader-spinner" /> : <IconCamera width={11} height={11} />}
      </span>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input-hidden"
      />
    </button>
  );
};

export default AvatarUploader;