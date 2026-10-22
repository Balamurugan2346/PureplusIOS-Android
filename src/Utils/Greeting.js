/**
 * Time-of-day greeting computed in IST (Asia/Kolkata, UTC+5:30), independent of
 * the device's own timezone — Pureplus is a Chennai-only service, so the wish
 * must always track Indian Standard Time, not wherever the handset is set.
 *
 * Converts "now" to UTC and applies the fixed +5:30 IST offset (India has no DST),
 * which avoids relying on Hermes Intl timeZone support.
 */
export const getIstHour = (date = new Date()) => {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const istMs = utcMs + 5.5 * 60 * 60 * 1000;
  return new Date(istMs).getHours();
};

export const getGreeting = (date = new Date()) => {
  const hour = getIstHour(date);
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
};
