import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Paper,
  Link as MuiLink,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

const PlayerLogin = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    identifier: '', // can be username or email
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.identifier.trim() || !form.password) {
      setError('Please enter your username/email and password')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/player/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials')
      }

      setSuccess('Login successful! Redirecting...')
      localStorage.setItem('currentUser', JSON.stringify(data.user))

      // redirect to home or dashboard
      setTimeout(() => navigate('/'), 900)
    } catch (err) {
      setError(err.message || 'Network error, could not reach API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }} elevation={2}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Player Login
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username or Email"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                error={!!errors.identifier}
                helperText={errors.identifier}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <MuiLink component={RouterLink} to="/PlayerCreate">
              Don’t have an account? Create one
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default PlayerLogin
