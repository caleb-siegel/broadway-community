import React, { useState, useEffect } from 'react'
import { Container, Typography } from '@mui/material'
import Table from './Table'
import Slider from './Slider'

function Home() {
    const showsOld = [
        {
            id: 1,
            name: "Hamilton",
            price: 144,
            image: "/hamilton.jpeg",
            seatCount: 4,
            seatLocation: "Center Orchestra",
            row: "Row F",
        },
        {
            id: 2,
            name: "Six",
            price: 75,
            image: "/six.jpeg",
            seatCount: 2,
            seatLocation: "Mezzanine",
            row: "Row B",
        },
        {
            id: 3,
            name: "MJ",
            price: 61,
            image: "/MJ.jpeg",
            seatCount: 1,
            seatLocation: "Center Orchestra",
            row: "Row A",
        },
        {
            id: 4,
            name: "& Juliet",
            price: 95,
            image: "/&juliet.jpeg",
            seatCount: 1,
            seatLocation: "Center Orchestra",
            row: "Row A",
        },
        {
            id: 5,
            name: "The Outsiders",
            price: 42,
            image: "/outsiders.jpg",
            seatCount: 1,
            seatLocation: "Center Orchestra",
            row: "Row A",
        },
    ]

    const [shows, setShows] = useState([]);
    useEffect(() => {
        fetch("http://127.0.0.1:5000/api/shows")
        .then((response) => response.json())
        .then((data) => {
            setShows(data);
        });
    }, []);

    return (
        <Container disableGutters sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 2 }}>
            <Typography variant="h2"> Welcome to the Broadway Community </Typography>
            <Typography variant="h3"> Making Broadway Affordable </Typography>
            <Slider shows={shows}/>
            <Table shows={shows}/>

        </Container>
    )
}

export default Home