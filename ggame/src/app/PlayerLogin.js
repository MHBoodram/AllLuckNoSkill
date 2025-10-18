import React, { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Box,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from '@mui/material'
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

export default function PlayerLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.identifier.trim() || !form.password) {
      setError('Please enter your username/email and password')
      return
    }

    setLoading(true)
    try {
      const players = JSON.parse(localStorage.getItem('players') || '[]')
      // match by username or email
      const user = players.find(
        (p) => p.username === form.identifier || p.email === form.identifier
      )
      if (!user) {
        setError('No account found with that username or email')
        setLoading(false)
        return
      }
      if (user.password !== form.password) {
        setError('Incorrect password')
        setLoading(false)
        return
      }
      // success: set currentUser and navigate
      localStorage.setItem('currentUser', JSON.stringify(user))
      setLoading(false)
      navigate('/')
    } catch (e) {
      console.error(e)
      setError('An error occurred while logging in')
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Username"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <MuiLink component={RouterLink} to="/PlayerCreate">
              Create account
            </MuiLink>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

