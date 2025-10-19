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

      </Paper>
    </Container>
  )
}

export default Home
