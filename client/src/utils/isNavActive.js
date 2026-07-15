/**
 * Robust check for whether a sidebar nav item should be highlighted as
 * active for the current URL. A plain `location.pathname === item.path`
 * comparison is brittle — it silently fails on a trailing slash, a
 * different letter casing, or a nested sub-route, even though React
 * Router itself would still resolve to the correct page in all of those
 * cases. This normalizes both sides before comparing, and also treats
 * any nested path (e.g. "/admin/tasks/123") as belonging to its parent
 * nav item ("/admin/tasks").
 */
export const isNavActive = (pathname, itemPath) => {
  const normalize = (p) => (p || '').toLowerCase().replace(/\/+$/, '') || '/';

  const current = normalize(pathname);
  const target = normalize(itemPath);

  return current === target || current.startsWith(`${target}/`);
};