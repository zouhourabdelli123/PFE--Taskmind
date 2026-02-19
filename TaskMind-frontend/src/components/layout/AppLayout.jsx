import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AssignmentRounded,
  CloudDownloadRounded,
  DashboardRounded,
  FolderOpenRounded,
  Groups2Rounded,
  HelpOutlineRounded,
  LogoutRounded,
  MenuRounded,
  MailOutlineRounded,
  NotificationsNoneRounded,
  SearchRounded,
  SettingsRounded,
} from '@mui/icons-material';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { logoutApi } from '../../api/auth.api';
import { useAuth } from '../../features/auth/AuthContext';

const DRAWER_WIDTH = 268;

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardRounded fontSize="small" /> },
  { label: 'Tasks', to: '/tasks', icon: <AssignmentRounded fontSize="small" />, badge: 5 },
  { label: 'Projects', to: '/projects', icon: <FolderOpenRounded fontSize="small" /> },
  { label: 'Team', to: '/teams', icon: <Groups2Rounded fontSize="small" /> },
];

const GENERAL_ITEMS = [
  { label: 'Settings', icon: <SettingsRounded fontSize="small" /> },
  { label: 'Help', icon: <HelpOutlineRounded fontSize="small" /> },
];

function SidebarContent({ user, onLogout, onCloseMobile }) {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Stack sx={{ height: '100%', py: 2.5 }}>
      {/* Brand */}
      <Box sx={{ px: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <Box component="span" sx={{ color: 'white', fontWeight: 900, fontSize: '1rem', lineHeight: 1, fontFamily: 'inherit' }}>T</Box>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'text.primary', lineHeight: 1.1 }}>
            TaskMind
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Workspace</Typography>
        </Box>
      </Box>

      {/* Menu Section */}
      <Box sx={{ flex: 1, px: 2, overflow: 'auto' }}>
        <Typography
          variant="caption"
          sx={{ px: 1.5, display: 'block', mb: 1, fontWeight: 700, color: 'text.disabled', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          Menu
        </Typography>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={onCloseMobile}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  px: 1.5,
                  color: isActive ? theme.palette.primary.dark : 'text.secondary',
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.text.primary, 0.04),
                    color: isActive ? theme.palette.primary.dark : 'text.primary',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.875rem',
                    color: 'inherit',
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: theme.palette.primary.main,
                      flexShrink: 0,
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>

        {/* General Section */}
        <Typography
          variant="caption"
          sx={{ px: 1.5, display: 'block', mt: 3, mb: 1, fontWeight: 700, color: 'text.disabled', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          General
        </Typography>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {GENERAL_ITEMS.map((item) => (
            <ListItemButton
              key={item.label}
              sx={{
                borderRadius: 3, py: 1.2, px: 1.5,
                color: 'text.secondary',
                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.04), color: 'text.primary' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: 'inherit' }} />
            </ListItemButton>
          ))}
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 3, py: 1.2, px: 1.5,
              color: 'error.main',
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.06) },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><LogoutRounded fontSize="small" /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem', color: 'inherit' }} />
          </ListItemButton>
        </List>
      </Box>


      {/* User Profile at bottom */}
      <Box
        sx={{
          mx: 2, mt: 2, p: 2, borderRadius: 3,
          bgcolor: alpha(theme.palette.text.primary, 0.03),
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
          transition: 'all 0.15s',
          '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.06) },
        }}
      >
        <Avatar
          src={`https://i.pravatar.cc/80?img=5`}
          sx={{ width: 36, height: 36, border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}` }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap color="text.primary" sx={{ fontSize: '0.825rem' }}>
            {user?.name || 'Mon Compte'}
          </Typography>
          <Typography variant="caption" noWrap color="text.secondary">
            {user?.email || 'user@taskmind.app'}
          </Typography>
        </Box>
        <Tooltip title="Settings">
          <SettingsRounded sx={{ fontSize: 16, color: 'text.disabled' }} />
        </Tooltip>
      </Box>
    </Stack>
  );
}

export function AppLayout() {
  const { user, clearSession } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try { await logoutApi(); } catch { /* ignore */ } finally { clearSession(); }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          border: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
          boxShadow: '0 1px 8px rgba(15,23,42,0.05)',
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: { xs: 64 } }}>
          {/* Mobile menu toggle */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2 }}
          >
            <MenuRounded fontSize="small" />
          </IconButton>

          {/* Search */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 380,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#f8fafc',
              border: `1.5px solid ${theme.palette.divider}`,
              borderRadius: 3,
              px: 1.5,
              py: 0.75,
              cursor: 'text',
              transition: 'all 0.2s',
              '&:focus-within': { borderColor: theme.palette.primary.main, bgcolor: 'white' },
            }}
          >
            <SearchRounded sx={{ fontSize: 18, color: 'text.disabled' }} />
            <Box
              component="input"
              placeholder="Search tasks, projects…"
              sx={{
                border: 'none', outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#0f172a',
                width: '100%',
                '&::placeholder': { color: '#94a3b8' },
              }}
            />
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', bgcolor: '#f1f5f9', borderRadius: 1, px: 1, py: 0.3, flexShrink: 0 }}>
              <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ fontSize: '0.7rem' }}>⌘K</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Action icons */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Messages">
              <IconButton sx={{ bgcolor: '#f8fafc', border: `1px solid ${theme.palette.divider}`, borderRadius: 2, width: 40, height: 40, color: 'text.secondary', '&:hover': { bgcolor: '#f1f5f9', color: 'text.primary' } }}>
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
                  <MailOutlineRounded sx={{ fontSize: 18 }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton sx={{ bgcolor: '#f8fafc', border: `1px solid ${theme.palette.divider}`, borderRadius: 2, width: 40, height: 40, color: 'text.secondary', '&:hover': { bgcolor: '#f1f5f9', color: 'text.primary' } }}>
                <Badge badgeContent={7} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}>
                  <NotificationsNoneRounded sx={{ fontSize: 18 }} />
                </Badge>
              </IconButton>
            </Tooltip>
          </Stack>

          {/* User */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              cursor: 'pointer',
              px: 1.5, py: 0.75,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: '#f8fafc',
              transition: 'all 0.15s',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          >
            <Avatar src="https://i.pravatar.cc/80?img=5" sx={{ width: 32, height: 32, border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}` }} />
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="subtitle2" lineHeight={1.2} color="text.primary" fontWeight={700}>{user?.name || 'Mon Compte'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.role || 'Admin'}</Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
            },
          }}
        >
          <SidebarContent user={user} onLogout={handleLogout} onCloseMobile={() => setMobileOpen(false)} />
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          mt: '64px',
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
