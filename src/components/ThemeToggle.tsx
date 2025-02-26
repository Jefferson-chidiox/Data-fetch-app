import React, { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'automatic';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('automatic');

  // Apply the selected theme
  useEffect(() => {
    const applyTheme = (mode: ThemeMode) => {
      if (mode === 'automatic') {
        // Use system preference for dark mode
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', mode);
      }
    };

    applyTheme(theme);

    // If automatic, add listener for changes in system preference
    let mediaQuery: MediaQueryList | null = null;
    if (theme === 'automatic' && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery?.removeEventListener('change', listener);
      };
    }
  }, [theme]);

  // Load any stored preference on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as ThemeMode;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <label htmlFor="theme-select" style={{ marginRight: '8px' }}>
        Theme:
      </label>
      <select id="theme-select" value={theme} onChange={handleChange}>
        <option value="automatic">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};

export default ThemeToggle;
