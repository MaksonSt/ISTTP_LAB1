import { useState } from 'react'
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Tabs, Tab, InputAdornment, IconButton, Alert,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface User {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
}

export default function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json() as { message?: string }
        setError(err.message || (mode === 'login' ? 'Login failed' : 'Registration failed'))
        return
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, role: data.role }))
      onLogin({ id: data.id, email: data.email, role: data.role })
    } catch {
      setError(mode === 'login' ? 'Login failed' : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
      p: 2,
    }}>
      <Card sx={{
        width: '100%',
        maxWidth: 420,
        background: '#1a1a2e',
        border: '1px solid #2a2a4a',
        borderRadius: 3,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ color: '#fff', textAlign: 'center', mb: 3, fontWeight: 700 }}>
            FootballHub
          </Typography>

          <Tabs
            value={mode}
            onChange={(_, v) => { setMode(v); setError('') }}
            sx={{
              mb: 3,
              background: '#0f0f1a',
              borderRadius: 2,
              minHeight: 40,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                color: '#666',
                minHeight: 40,
                borderRadius: 1.5,
                flex: 1,
                transition: 'all 0.2s',
              },
              '& .Mui-selected': {
                color: '#0f0f1a !important',
                background: '#4fc3f7',
                borderRadius: 1.5,
              },
            }}
          >
            <Tab label="Login" value="login" />
            <Tab label="Register" value="register" />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoFocus
              fullWidth
              variant="outlined"
              size="small"
              sx={inputSx}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              fullWidth
              variant="outlined"
              size="small"
              sx={inputSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(v => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: '#666', '&:hover': { color: '#aaa' } }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ background: 'rgba(229,115,115,0.1)', color: '#ef5350', border: '1px solid #e57373' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                mt: 1,
                py: 1.3,
                background: '#4fc3f7',
                color: '#0f0f1a',
                fontWeight: 700,
                borderRadius: 2,
                '&:hover': { background: '#81d4fa', boxShadow: '0 8px 20px rgba(79,195,247,0.3)' },
                '&:disabled': { opacity: 0.6 },
              }}
            >
              {loading
                ? (mode === 'login' ? 'Logging in...' : 'Registering...')
                : (mode === 'login' ? 'Login' : 'Create account')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: '#0f0f1a',
    borderRadius: 2,
    '& fieldset': { borderColor: '#2a2a4a' },
    '&:hover fieldset': { borderColor: '#4fc3f7' },
    '&.Mui-focused fieldset': { borderColor: '#4fc3f7' },
  },
  '& .MuiInputLabel-root': { color: '#666' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#4fc3f7' },
}
