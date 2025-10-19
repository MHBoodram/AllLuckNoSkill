import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Box, Typography, Button, Paper } from '@mui/material'

const Cougar = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-mRo4EvFbp57hnrZTA7NwKUr4fCwOp4.png'

const Home = () => {
  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, textAlign: 'center', width: '100%' }} elevation={3}>
        <Box sx={{ mb: 2 }}>
          <img src={Cougar} alt="logo" style={{ width: 160, height: 'auto', borderRadius: 8 }} />
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          All Luck No Skill — Game
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Sign in or create an account to start playing.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={Link} to="/PlayerLogin" variant="contained" size="large">
            Log in
          </Button>
          <Button component={Link} to="/PlayerCreate" variant="outlined" size="large">
            Create account
          </Button>
          <Button component={Link} to="/Game" variant= "outlined" size = "large">
          Guest
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Home
