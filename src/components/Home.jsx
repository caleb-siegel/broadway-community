import { Container } from '@mui/material'
import React from 'react'
import Slider from './Slider'
import HeroBanner from './HeroBanner'

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
        {
            id: 3,
            name: "MJ",
            price: 61,
            image: "/public/MJ.jpeg",
            seatCount: 1,
            seatLocation: "Center Orchestra",
            row: "Row A",
        },
    ]
    return (
        <Container disableGutters sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 2 }}>
            <HeroBanner />
            <Slider shows={shows} />
        </Container>
    )
}

export default Home