import { Container, Box, Typography } from '@mui/material'
import React from 'react'
import ShowCard from './ShowCard'
import Slider from './Slider'

function Home() {
    const shows = [
        {
            id: 1,
            name: "Hamilton",
            price: 144,
            image: "/public/hamilton.jpeg",
            seatCount: 4,
            seatLocation: "Center Orchestra",
            row: "Row F",
        },
        {
            id: 2,
            name: "Six",
            price: 75,
            image: "/public/six.jpeg",
            seatCount: 2,
            seatLocation: "Mezzanine",
            row: "Row B",
        },
    ]
    return (
        <Container disableGutters sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 2 }}>
        <Box>
          <Typography variant="h2" gutterBottom>Welcome to the Broadway Community</Typography>
          <Typography variant="h3" gutterBottom>Where We Make Broadway Affordable</Typography>
        </Box>
        <Slider shows={shows} />
      </Container>
  )
}

export default Home