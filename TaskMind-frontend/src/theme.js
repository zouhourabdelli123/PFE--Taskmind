import { createTheme, alpha } from '@mui/material';

const PRIMARY = '#16a34a';      // Vivid green
const PRIMARY_DARK = '#15803d'; // Darker green
const PRIMARY_LIGHT = '#bbf7d0'; // Pale green
const SURFACE = '#ffffff';
const BG = '#f0f4f8';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY,
      light: '#4ade80',
      dark: PRIMARY_DARK,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1',
      light: '#a5b4fc',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#6ee7b7',
      dark: '#065f46',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fde68a',
      dark: '#b45309',
    },
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#b91c1c',
    },
    info: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#1d4ed8',
    },
    background: {
      default: BG,
      paper: SURFACE,
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: '#e2e8f0',
    action: {
      hover: alpha(PRIMARY, 0.06),
      selected: alpha(PRIMARY, 0.1),
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Manrope", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.03em', color: '#0f172a' },
    h2: { fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.025em', color: '#0f172a' },
    h3: { fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', color: '#0f172a' },
    h4: { fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.015em', color: '#0f172a' },
    h5: { fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em', color: '#0f172a' },
    h6: { fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.005em', color: '#0f172a' },
    subtitle1: { fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem', color: '#334155' },
    body1: { fontSize: '0.9rem', lineHeight: 1.65, color: '#475569' },
    body2: { fontSize: '0.82rem', lineHeight: 1.6, color: '#64748b' },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, color: '#94a3b8' },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(15,23,42,0.06), 0px 1px 2px rgba(15,23,42,0.04)',
    '0px 2px 6px rgba(15,23,42,0.06), 0px 1px 3px rgba(15,23,42,0.04)',
    '0px 4px 12px rgba(15,23,42,0.08), 0px 2px 4px rgba(15,23,42,0.04)',
    '0px 6px 20px rgba(15,23,42,0.08), 0px 3px 6px rgba(15,23,42,0.04)',
    '0px 8px 24px rgba(15,23,42,0.10), 0px 4px 8px rgba(15,23,42,0.04)',
    '0px 12px 32px rgba(15,23,42,0.10), 0px 4px 12px rgba(15,23,42,0.04)',
    '0px 16px 40px rgba(15,23,42,0.10), 0px 6px 16px rgba(15,23,42,0.04)',
    '0px 20px 48px rgba(15,23,42,0.12), 0px 8px 20px rgba(15,23,42,0.04)',
    '0px 24px 56px rgba(15,23,42,0.12), 0px 10px 24px rgba(15,23,42,0.04)',
    '0px 28px 64px rgba(15,23,42,0.14)',
    '0px 32px 72px rgba(15,23,42,0.14)',
    '0px 36px 80px rgba(15,23,42,0.16)',
    '0px 40px 88px rgba(15,23,42,0.16)',
    '0px 44px 96px rgba(15,23,42,0.18)',
    '0px 48px 104px rgba(15,23,42,0.18)',
    '0px 52px 112px rgba(15,23,42,0.20)',
    '0px 56px 120px rgba(15,23,42,0.20)',
    '0px 60px 128px rgba(15,23,42,0.22)',
    '0px 64px 136px rgba(15,23,42,0.22)',
    '0px 68px 144px rgba(15,23,42,0.24)',
    '0px 72px 152px rgba(15,23,42,0.24)',
    '0px 76px 160px rgba(15,23,42,0.26)',
    '0px 80px 168px rgba(15,23,42,0.26)',
    '0px 84px 176px rgba(15,23,42,0.28)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: {
          backgroundColor: BG,
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent',
          '&::-webkit-scrollbar': { width: '6px', height: '6px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '10px',
            '&:hover': { background: '#94a3b8' },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '9px 20px',
          fontSize: '0.875rem',
          fontWeight: 700,
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
          boxShadow: `0 4px 14px ${alpha(PRIMARY, 0.35)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, #14532d 100%)`,
            boxShadow: `0 6px 20px ${alpha(PRIMARY, 0.45)}`,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px', background: alpha(PRIMARY, 0.04) },
        },
        sizeSmall: { padding: '6px 14px', fontSize: '0.8125rem', borderRadius: 10 },
        sizeLarge: { padding: '12px 28px', fontSize: '0.9375rem', borderRadius: 14 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #f1f5f9',
        },
        elevation1: { boxShadow: '0px 1px 3px rgba(15,23,42,0.06), 0px 1px 2px rgba(15,23,42,0.04)' },
        elevation2: { boxShadow: '0px 2px 6px rgba(15,23,42,0.06)' },
        elevation3: { boxShadow: '0px 4px 12px rgba(15,23,42,0.08)' },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #f1f5f9',
          borderRadius: 20,
          backgroundImage: 'none',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s',
            '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: PRIMARY, borderWidth: '2px' },
            '&.Mui-focused': { backgroundColor: '#ffffff' },
          },
          '& .MuiInputLabel-root': { fontWeight: 500, fontSize: '0.875rem' },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.15s ease',
          '&.Mui-selected': {
            backgroundColor: alpha(PRIMARY, 0.1),
            color: PRIMARY_DARK,
            '&:hover': { backgroundColor: alpha(PRIMARY, 0.12) },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 26,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.875rem',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor: '#1e293b',
          padding: '6px 12px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#f1f5f9' },
      },
    },
  },
});
