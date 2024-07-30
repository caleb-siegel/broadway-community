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
    <Container>
        <Box>
            <Typography variant="h1">Welcome to the Broadway Community</Typography>
            <Typography variant="h2">Where We Make Broadway Affordable</Typography>
            {/* <video class="x1lliihq x5yr21d xh8yej3" playsinline="" preload="none" src="blob:https://www.instagram.com/bed48ae9-f8a8-48e4-ae87-45354fa14792" style="display: block;"></video> */}
        </Box>
        <Slider shows={shows} />
        {/* {shows.map(show => {
            return <ShowCard key={show.id} show={show}></ShowCard>
        })} */}
    </Container>
  )
}

export default Home