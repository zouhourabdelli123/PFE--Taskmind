import {
    AddRounded,
    ArrowUpwardRounded,
    AvTimerRounded,
    TrendingUpRounded,
    MoreHorizRounded,
    EmojiEventsRounded,
    PendingActionsRounded,
    CheckCircleOutlineRounded,
    PlayCircleOutlineRounded,
} from '@mui/icons-material';
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    Tooltip,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';

// Static bar heights to avoid Math.random() re-render issue
const CHART_DATA = [
    { day: 'Mon', height: 45, tasks: 9 },
    { day: 'Tue', height: 70, tasks: 14 },
    { day: 'Wed', height: 60, tasks: 12 },
    { day: 'Thu', height: 90, tasks: 18 },
    { day: 'Fri', height: 75, tasks: 15 },
    { day: 'Sat', height: 35, tasks: 7 },
    { day: 'Sun', height: 20, tasks: 4 },
];

const TEAM = [
    { name: 'Alexandra Deff', role: 'Github Repository Setup', status: 'Completed', img: 10 },
    { name: 'Edwin Adenike', role: 'User Authentication Flow', status: 'In Progress', img: 11 },
    { name: 'Isaac Oluwatemilorun', role: 'Search & Filter Feature', status: 'Pending', img: 12 },
    { name: 'David Oshodi', role: 'Responsive Homepage Layout', status: 'In Progress', img: 13 },
];

const PROJECTS = [
    { title: 'API Endpoints Development', date: 'Nov 26', progress: 80, color: '#6366f1', icon: '⚡' },
    { title: 'User Onboarding Flow', date: 'Nov 28', progress: 55, color: '#f59e0b', icon: '🌊' },
    { title: 'Analytics Dashboard', date: 'Nov 30', progress: 65, color: '#16a34a', icon: '📊' },
    { title: 'Performance Optimization', date: 'Dec 5', progress: 30, color: '#ef4444', icon: '🚀' },
    { title: 'Cross-Browser Testing', date: 'Dec 6', progress: 15, color: '#8b5cf6', icon: '🧪' },
];

const STATUS_CONFIG = {
    Completed: { bg: alpha('#10b981', 0.1), color: '#059669', icon: <CheckCircleOutlineRounded sx={{ fontSize: 14 }} /> },
    'In Progress': { bg: alpha('#f59e0b', 0.1), color: '#d97706', icon: <PlayCircleOutlineRounded sx={{ fontSize: 14 }} /> },
    Pending: { bg: alpha('#ef4444', 0.1), color: '#dc2626', icon: <PendingActionsRounded sx={{ fontSize: 14 }} /> },
};

// ----- Sub-components -----

function StatCard({ title, value, diff, subtitle, icon, accent = '#16a34a', dark = false }) {
    const theme = useTheme();
    return (
        <Card
            sx={{
                p: 2.5,
                height: '100%',
                background: dark
                    ? `linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%)`
                    : theme.palette.background.paper,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(15,23,42,0.1)' },
            }}
        >
            {/* Background accent blob */}
            {dark && (
                <Box sx={{
                    position: 'absolute', top: -30, right: -30,
                    width: 120, height: 120, borderRadius: '50%',
                    bgcolor: alpha(accent, 0.15),
                }} />
            )}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2, position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: 2.5,
                        bgcolor: dark ? alpha(accent, 0.2) : alpha(accent, 0.1),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: dark ? alpha(accent, 0.9) : accent,
                    }}
                >
                    {icon}
                </Box>
                <Box
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 0.4,
                        bgcolor: dark ? alpha('#10b981', 0.15) : alpha('#10b981', 0.1),
                        color: dark ? '#6ee7b7' : '#059669',
                        px: 1, py: 0.3, borderRadius: 1, fontSize: '0.72rem', fontWeight: 700,
                    }}
                >
                    <ArrowUpwardRounded sx={{ fontSize: 12 }} />
                    {diff}
                </Box>
            </Stack>
            <Typography variant="h3" fontWeight={800} sx={{ color: dark ? 'white' : 'text.primary', mb: 0.5, position: 'relative', zIndex: 1 }}>
                {value}
            </Typography>
            <Typography variant="body2" sx={{ color: dark ? 'rgba(255,255,255,0.55)' : 'text.secondary', position: 'relative', zIndex: 1 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="caption" sx={{ color: dark ? 'rgba(255,255,255,0.35)' : 'text.disabled', display: 'block', mt: 0.5, position: 'relative', zIndex: 1 }}>
                    {subtitle}
                </Typography>
            )}
        </Card>
    );
}

function BarChart() {
    const theme = useTheme();
    const maxHeight = Math.max(...CHART_DATA.map(d => d.height));
    return (
        <Stack direction="row" alignItems="flex-end" sx={{ height: 150, gap: 1, pt: 1 }}>
            {CHART_DATA.map((d, i) => {
                const isToday = i === 3;
                return (
                    <Tooltip key={d.day} title={`${d.tasks} tasks`} placement="top">
                        <Stack alignItems="center" sx={{ flex: 1, cursor: 'pointer' }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: `${(d.height / maxHeight) * 100}%`,
                                    minHeight: 8,
                                    borderRadius: '8px 8px 4px 4px',
                                    bgcolor: isToday
                                        ? theme.palette.primary.main
                                        : d.height > 60
                                            ? alpha(theme.palette.primary.main, 0.5)
                                            : alpha(theme.palette.primary.main, 0.2),
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.main,
                                        transform: 'scaleX(1.1)',
                                    },
                                    ...(isToday && {
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    }),
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{ mt: 0.75, fontWeight: isToday ? 700 : 500, color: isToday ? 'primary.main' : 'text.disabled', fontSize: '0.7rem' }}
                            >
                                {d.day}
                            </Typography>
                        </Stack>
                    </Tooltip>
                );
            })}
        </Stack>
    );
}

// ----- Main Page -----

export function DashboardPage() {
    const theme = useTheme();

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
                <Box>
                    <Typography variant="h4" color="text.primary">Good morning 👋</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                        Here's what's happening with your projects today.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="outlined"
                        sx={{ bgcolor: 'background.paper', borderColor: 'divider', color: 'text.primary', fontWeight: 600 }}
                    >
                        Import Data
                    </Button>
                    <Button variant="contained" startIcon={<AddRounded />}>
                        New Project
                    </Button>
                </Stack>
            </Stack>

            {/* Stats */}
            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Projects"
                        value="24"
                        diff="+5 this month"
                        icon={<TrendingUpRounded />}
                        accent="#16a34a"
                        dark
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Completed"
                        value="10"
                        diff="+6 this week"
                        icon={<CheckCircleOutlineRounded />}
                        accent="#10b981"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="In Progress"
                        value="12"
                        diff="+2 today"
                        icon={<PlayCircleOutlineRounded />}
                        accent="#6366f1"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pending"
                        value="2"
                        diff="No change"
                        subtitle="On discussion"
                        icon={<PendingActionsRounded />}
                        accent="#f59e0b"
                    />
                </Grid>
            </Grid>

            {/* Main Content */}
            <Grid container spacing={2.5}>
                {/* Left column */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2.5}>
                        {/* Analytics + Reminder row */}
                        <Grid container spacing={2.5}>
                            {/* Bar Chart */}
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Paper sx={{ p: 3, height: '100%' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                                        <Box>
                                            <Typography variant="h6" color="text.primary">Task Analytics</Typography>
                                            <Typography variant="caption" color="text.secondary">Tasks completed per day</Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            {['Week', 'Month'].map((label, i) => (
                                                <Box
                                                    key={label}
                                                    sx={{
                                                        px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.75rem', fontWeight: 700,
                                                        cursor: 'pointer',
                                                        bgcolor: i === 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                                        color: i === 0 ? 'primary.main' : 'text.secondary',
                                                        border: i === 0 ? 'none' : `1px solid ${theme.palette.divider}`,
                                                    }}
                                                >
                                                    {label}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Stack>
                                    <BarChart />
                                </Paper>
                            </Grid>

                            {/* Meeting Reminder */}
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Paper
                                    sx={{
                                        p: 3, height: '100%', display: 'flex', flexDirection: 'column',
                                        background: `linear-gradient(145deg, #1e293b 0%, #0f2d1b 100%)`,
                                        border: 'none',
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                        <Chip
                                            label="Upcoming"
                                            size="small"
                                            sx={{ bgcolor: alpha(theme.palette.warning.main, 0.2), color: theme.palette.warning.light, fontWeight: 700, fontSize: '0.7rem' }}
                                        />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Today 2:00 PM</Typography>
                                    </Stack>
                                    <Typography variant="h6" sx={{ color: 'white', mb: 0.75 }}>
                                        Meeting with Arc Company
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 'auto' }}>
                                        Q3 Review & Product Roadmap planning session.
                                    </Typography>
                                    <AvatarGroup max={3} sx={{ my: 2, '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.7rem', borderColor: '#1e293b' } }}>
                                        {[10, 11, 12, 13].map(n => <Avatar key={n} src={`https://i.pravatar.cc/60?img=${n}`} />)}
                                    </AvatarGroup>
                                    <Button
                                        variant="contained"
                                        startIcon={<AvTimerRounded />}
                                        fullWidth
                                        sx={{
                                            bgcolor: theme.palette.primary.main,
                                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.45)}`,
                                            borderRadius: 2.5,
                                        }}
                                    >
                                        Join Meeting
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Team */}
                        <Paper sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                                <Box>
                                    <Typography variant="h6" color="text.primary">Team Collaboration</Typography>
                                    <Typography variant="caption" color="text.secondary">4 members active</Typography>
                                </Box>
                                <Button size="small" variant="outlined" startIcon={<AddRounded />} sx={{ borderRadius: 2.5 }}>
                                    Add Member
                                </Button>
                            </Stack>
                            <Stack spacing={1.5}>
                                {TEAM.map((m, i) => {
                                    const cfg = STATUS_CONFIG[m.status];
                                    return (
                                        <Stack
                                            key={i}
                                            direction="row"
                                            spacing={1.5}
                                            alignItems="center"
                                            sx={{
                                                p: 1.5, borderRadius: 3,
                                                transition: 'background 0.15s',
                                                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.03) },
                                            }}
                                        >
                                            <Avatar src={`https://i.pravatar.cc/80?img=${m.img}`} sx={{ width: 40, height: 40 }} />
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="subtitle2" noWrap color="text.primary">{m.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap>{m.role}</Typography>
                                            </Box>
                                            <Chip
                                                label={m.status}
                                                icon={cfg.icon}
                                                size="small"
                                                sx={{ bgcolor: cfg.bg, color: cfg.color, border: 'none', fontWeight: 700, '& .MuiChip-icon': { color: cfg.color } }}
                                            />
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Paper>
                    </Stack>
                </Grid>

                {/* Right column */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={2.5}>
                        {/* Progress ring */}
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.primary" sx={{ mb: 2, textAlign: 'left' }}>Overall Progress</Typography>
                            <Box sx={{ position: 'relative', width: 160, height: 100, mx: 'auto' }}>
                                <svg viewBox="0 0 100 58" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                                    {/* Track */}
                                    <path d="M 12 50 A 38 38 0 0 1 88 50" fill="none" stroke="#e2e8f0" strokeWidth="9" strokeLinecap="round" />
                                    {/* Progress ~58% */}
                                    <path d="M 12 50 A 38 38 0 0 1 72 18" fill="none" stroke={theme.palette.primary.main} strokeWidth="9" strokeLinecap="round" />
                                    {/* Secondary progress */}
                                    <path d="M 72 18 A 38 38 0 0 1 88 50" fill="none" stroke={alpha(theme.palette.secondary.main, 0.3)} strokeWidth="9" strokeLinecap="round" />
                                </svg>
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                                    <Typography variant="h4" fontWeight={800} color="text.primary">58%</Typography>
                                    <Typography variant="caption" color="text.secondary">Completed</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={1.5}>
                                {[
                                    { label: 'Completed', value: 58, color: theme.palette.primary.main },
                                    { label: 'In Progress', value: 33, color: theme.palette.secondary.main },
                                    { label: 'Pending', value: 9, color: '#e2e8f0' },
                                ].map(item => (
                                    <Stack key={item.label} direction="row" alignItems="center" spacing={1.5}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0, border: item.label === 'Pending' ? '1px solid #cbd5e1' : 'none' }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>{item.label}</Typography>
                                        <Typography variant="subtitle2" color="text.primary">{item.value}%</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </Paper>

                        {/* Project list */}
                        <Paper sx={{ overflow: 'hidden' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                                <Typography variant="h6" color="text.primary">Projects</Typography>
                                <Button size="small" variant="outlined" sx={{ borderRadius: 2.5 }} startIcon={<AddRounded />}>New</Button>
                            </Stack>
                            <Stack>
                                {PROJECTS.map((p, i) => (
                                    <Box key={i}>
                                        <Stack
                                            direction="row"
                                            spacing={1.5}
                                            alignItems="center"
                                            sx={{
                                                px: 2.5, py: 1.5, cursor: 'pointer',
                                                transition: 'background 0.15s',
                                                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.03) },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 36, height: 36, borderRadius: 2,
                                                    bgcolor: alpha(p.color, 0.1),
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '1rem', flexShrink: 0,
                                                }}
                                            >
                                                {p.icon}
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="subtitle2" noWrap color="text.primary">{p.title}</Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={p.progress}
                                                    sx={{
                                                        mt: 0.6, height: 4, borderRadius: 4,
                                                        bgcolor: alpha(p.color, 0.12),
                                                        '& .MuiLinearProgress-bar': { bgcolor: p.color, borderRadius: 4 },
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0, fontWeight: 600 }}>{p.progress}%</Typography>
                                        </Stack>
                                        {i < PROJECTS.length - 1 && <Divider sx={{ mx: 2.5 }} />}
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        {/* Time Tracker */}
                        <Card
                            sx={{
                                p: 3,
                                background: `linear-gradient(145deg, #0f172a 0%, #0d2115 100%)`,
                                border: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ position: 'absolute', bottom: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.12) }} />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, position: 'relative', zIndex: 1 }}>
                                <Typography variant="body2" fontWeight={700} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
                                    Time Tracker
                                </Typography>
                                <Chip
                                    label="● Live"
                                    size="small"
                                    sx={{ bgcolor: alpha(theme.palette.success.main, 0.2), color: theme.palette.success.light, fontWeight: 700, fontSize: '0.68rem', height: 22 }}
                                />
                            </Stack>
                            <Typography
                                variant="h3"
                                sx={{ color: 'white', fontWeight: 300, letterSpacing: '0.06em', fontVariantNumeric: 'tabular-nums', position: 'relative', zIndex: 1 }}
                            >
                                01:24:08
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', display: 'block', mb: 3, position: 'relative', zIndex: 1 }}>
                                Design — API Integration
                            </Typography>
                            <Stack direction="row" spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
                                <IconButton
                                    size="small"
                                    sx={{
                                        bgcolor: 'white', width: 38, height: 38, borderRadius: 2,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'scale(1.05)' },
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <Stack direction="row" spacing="3px" alignItems="center">
                                        <Box sx={{ width: 3, height: 12, bgcolor: '#1e293b', borderRadius: 1 }} />
                                        <Box sx={{ width: 3, height: 12, bgcolor: '#1e293b', borderRadius: 1 }} />
                                    </Stack>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.error.main, 0.2), width: 38, height: 38, borderRadius: 2, border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.3), transform: 'scale(1.05)' },
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <Box sx={{ width: 10, height: 10, bgcolor: theme.palette.error.light, borderRadius: 0.5 }} />
                                </IconButton>
                            </Stack>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    );
}
