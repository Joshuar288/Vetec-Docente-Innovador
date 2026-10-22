export function normalizeName(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}
export function validName(value) {
  const name = normalizeName(value);
  return name.length >= 2 && name.length <= 80;
}
export function hasCompletedProfile(user) {
  return !!user?.id && validName(user.user_metadata?.app_name);
}
export function accessMode({ ready, user, guest }) {
  if (!ready) return 'loading';
  if (user) return hasCompletedProfile(user) ? 'account' : 'profile';
  return guest ? 'guest' : 'login';
}
