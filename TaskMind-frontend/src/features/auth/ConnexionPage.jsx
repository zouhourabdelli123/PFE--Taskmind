import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CheckCircleRounded,
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginApi } from '../../api/auth.api';
import { getApiError } from '../../api/client';
import { useAuth } from './AuthContexte';

const FEATURES = [
  'Gérez les tâches de tous vos projets',
  'Collaboration en temps réel avec votre équipe',
  'Suivez les progrès avec des analyses intelligentes',
  'Sprints et jalons bien organisés',
];

export function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginApi({
        email: form.email,
        password: form.password,
        device_name: 'react-web',
      });
      setSession(response.token, response.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getApiError(err));
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f4f8' }}>

      {/* ── Left Panel ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '46%',
          minHeight: '100vh',
          background: `linear-gradient(145deg, #0f172a 0%, #0d2115 60%, #14532d 100%)`,
          p: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern overlay */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            zIndex: 0,
          }}
        />

        {/* Glow blobs */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', bgcolor: alpha('#16a34a', 0.2), filter: 'blur(80px)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', bgcolor: alpha('#6366f1', 0.15), filter: 'blur(70px)', zIndex: 0 }} />

        {/* Logo */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: '12px',
                background: `linear-gradient(135deg, #16a34a, #15803d)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 16px ${alpha('#16a34a', 0.5)}`,
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>T</Typography>
            </Box>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
              TaskMind
            </Typography>
          </Stack>
        </Box>

        {/* Central content */}
        <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, mb: 2 }}>
              Gérez votre travail,{' '}
              <Box component="span" sx={{ color: '#4ade80' }}>
                plus intelligemment.
              </Box>
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.7 }}>
              TaskMind rassemble votre équipe, vos projets et vos tâches dans un espace de travail puissant.
            </Typography>
          </Box>

          {/* Feature list */}
          <Stack spacing={2}>
            {FEATURES.map((feature, i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    bgcolor: alpha('#4ade80', 0.15),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <CheckCircleRounded sx={{ fontSize: 14, color: '#4ade80' }} />
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          {[
            { value: '10K+', label: 'Utilisateurs actifs' },
            { value: '50K+', label: 'Tâches gérées' },
            { value: '99.9%', label: 'Disponibilité' },
          ].map((stat) => (
            <Box key={stat.label}>
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
                {stat.value}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── Right Panel ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 5 },
          bgcolor: '#ffffff',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Mobile logo */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ display: { md: 'none' }, mb: 5 }}
        >
          <Box
            sx={{
              width: 36, height: 36, borderRadius: '10px',
              background: `linear-gradient(135deg, #16a34a, #15803d)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1rem' }}>T</Typography>
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary' }}>TaskMind</Typography>
        </Stack>

        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.025em', mb: 1 }}>
              Bon retour 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connectez-vous pour accéder à votre espace de travail.
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 3, bgcolor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Stack component="form" onSubmit={onSubmit} spacing={2.5}>
            {/* Email */}
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.75, ml: 0.5 }}>
                Adresse e-mail
              </Typography>
              <TextField
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
                fullWidth
                disabled={loading}
                placeholder="you@example.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 0.5 }}>
                  Mot de passe
                </Typography>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="caption"
                  color="primary.main"
                  underline="hover"
                  fontWeight={700}
                >
                  Mot de passe oublié ?
                </Link>
              </Stack>
              <TextField
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={updateField}
                required
                fullWidth
                disabled={loading}
                placeholder="••••••••"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((s) => !s)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          size="small"
                          sx={{ color: 'text.disabled' }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Remember me */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{ color: 'text.disabled', '&.Mui-checked': { color: 'primary.main' } }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Rester connecté
                </Typography>
              }
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              sx={{ py: 1.6, fontSize: '0.95rem', fontWeight: 700, borderRadius: 3, mt: 0.5 }}
            >
              {loading ? (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={18} sx={{ color: 'white' }} />
                  <span>Connexion en cours…</span>
                </Stack>
              ) : 'Se connecter à TaskMind'}
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ px: 1 }}>
              OU
            </Typography>
          </Divider>

          {/* Register link */}
          <Box
            sx={{
              textAlign: 'center',
              p: 2.5,
              border: `1.5px solid ${theme.palette.divider}`,
              borderRadius: 3,
              bgcolor: '#f8fafc',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Vous n'avez pas de compte ?{' '}
              <Link component={RouterLink} to="/register" fontWeight={700} color="primary.main" underline="hover">
                Créer un compte gratuit →
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Typography variant="caption" color="text.disabled" sx={{ position: 'absolute', bottom: 24, textAlign: 'center' }}>
          © 2025 TaskMind · Tous droits réservés
        </Typography>
      </Box>
    </Box>
  );
}
