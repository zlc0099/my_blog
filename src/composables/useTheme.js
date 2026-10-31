import { ref } from 'vue';

const theme = ref('dark');
let initialized = false;

function applyTheme(value) {
  theme.value = value;
  document.documentElement.dataset.theme = value;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', value === 'light' ? '#EEF0EC' : '#111315');
  try {
    localStorage.setItem('pa-theme', value);
  } catch (error) {
    // Persistence is optional when storage is unavailable.
  }
}

export function useTheme() {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true;
    try {
      const saved = localStorage.getItem('pa-theme');
      theme.value = saved === 'light' ? 'light' : 'dark';
    } catch (error) {
      theme.value = 'dark';
    }
    document.documentElement.dataset.theme = theme.value;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.value === 'light' ? '#EEF0EC' : '#111315');
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark');
  }

  return { theme, toggleTheme };
}
