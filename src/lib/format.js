export function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = String(value).split('-');
  return day ? `${year}.${month}.${day}` : String(value);
}

export function formatDateShort(value) {
  if (!value) return '';
  const [, month, day] = String(value).split('-');
  return day ? `${month}.${day}` : String(value);
}

export function formatYear(value) {
  return String(value || '').slice(0, 4);
}

export function formatMonth(value) {
  const [year, month] = String(value || '').split('-');
  return month ? `${year}.${month}` : String(value || '');
}

export function formatMonthShort(value) {
  return String(value || '').slice(5);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Number(value) || 0);
}

export function formatTokens(value) {
  const number = Number(value) || 0;
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1).replace(/\.?0+$/, '')}K`;
  }
  return String(number);
}

export function formatPercent(part, total) {
  if (!total) return '0';
  return String(Math.round((part / total) * 100));
}

export function formatDuration(minutes) {
  if (minutes === null || minutes === undefined || Number.isNaN(minutes)) return '—';
  if (minutes < 1) return '<1m';
  const rounded = Math.round(minutes);
  if (rounded < 60) return `${rounded}m`;
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return `${hours}h ${String(rest).padStart(2, '0')}m`;
}

export function readingTime(source) {
  const text = String(source || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9_]+/g) || []).length;
  return Math.max(1, Math.round(cjk / 350 + words / 220));
}

export function toTagSlug(tag) {
  return String(tag)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function padIndex(value) {
  return String(value).padStart(2, '0');
}
