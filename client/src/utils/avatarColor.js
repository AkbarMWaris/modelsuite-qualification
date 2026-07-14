/**
 * Deterministic gradient background for an avatar's initials fallback,
 * derived from the person's name so the same user always gets the same
 * color. Shared by <Avatar /> and anywhere else that needs it (e.g. the
 * "assigned to" column in TasksTable).
 */
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#3B82F6,#2563EB)',
  'linear-gradient(135deg,#8B5CF6,#7C3AED)',
  'linear-gradient(135deg,#10B981,#059669)',
  'linear-gradient(135deg,#F59E0B,#D97706)',
];

export const getAvatarGradient = (name = '') => {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
};