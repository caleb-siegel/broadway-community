import { Container, Box, Typography } from '@mui/material'
import React from 'react'

function Home() {
  const shows = [
    {
        id: 1,
        name: "Hamilton",
        price: 144,
    },
    {
        id: 2,
        name: "Six",
        price: 75,
    },
  ]
    return (
    <Container>
        <Box sx={{ bgcolor: "background.main"}}>
            <Typography variant="h1">Welcome to the Broadway Community</Typography>
            <Typography variant="h2">Where We Make Broadway Affordable</Typography>
        </Box>
        {shows.map(show => {
            return <Typography key={show.id} variant="h3">{show.name} - ${show.price}</Typography>
        })}
    </Container>
  )
}

export default Home