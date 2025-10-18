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

function validateEmail(email) {
  // simple email regex
  return /^\S+@\S+\.\S+$/.test(email)
}

const PlayerCreate = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    const err = {}
    if (!form.firstName.trim()) err.firstName = 'First name is required'
    if (!form.lastName.trim()) err.lastName = 'Last name is required'
    if (!form.username.trim()) err.username = 'Username is required'
    if (!form.email.trim()) err.email = 'Email is required'
    else if (!validateEmail(form.email)) err.email = 'Enter a valid email'
    if (!form.password) err.password = 'Password is required'
    else if (form.password.length < 6) err.password = 'Password must be at least 6 characters'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate()
    setErrors(err)
    if (Object.keys(err).length === 0) {
      // For now save to localStorage as a simple demo and show success
      try {
        const players = JSON.parse(localStorage.getItem('players') || '[]')
        players.push({ ...form, createdAt: new Date().toISOString() })
        localStorage.setItem('players', JSON.stringify(players))
        setSuccess('Account created successfully!')
        // small delay so user sees the message, then navigate home
        setTimeout(() => navigate('/'), 900)
      } catch (e) {
        console.error(e)
        setErrors({ form: 'Could not save account locally' })
      }
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }} elevation={2}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Create Account
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {errors.form && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.form}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                type="email"
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
              <Button variant="contained" color="primary" type="submit">
                Create account
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <MuiLink component={RouterLink} to="/PlayerLogin">
              Already have an account? Log in
            </MuiLink>
            
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default PlayerCreate
