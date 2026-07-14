import API from './axios';

/**
 * Uploads a new avatar image file for the logged-in user.
 * Sent as multipart/form-data since it's a real file, not JSON.
 */
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return API.put('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};