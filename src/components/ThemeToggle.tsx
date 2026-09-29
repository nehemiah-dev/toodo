import { useTheme, type Theme } from '../hooks/useTheme.ts'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function cycleTheme() {
    const next: Record<Theme, Theme> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    }
    setTheme(next[theme])
  }

  const label = {
    light: '☀️ Light',
    dark: '🌙 Dark',
    system: '💻 System',
  }[theme]

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to cycle.`}
      title="Toggle theme (Light → Dark → System)"
    >
      {label}
    </button>
  )
}

export default ThemeToggle
