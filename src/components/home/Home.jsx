import React, { useState, useEffect } from 'react'
import { Container, Typography } from '@mui/material'
import Table from '../table/Table'
import Slider from '../slider/Slider'
import "./home.css";
import Search from '../search/Search';
import ShowSkeleton from './ShowSkeleton';


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
    const [loading, setLoading] = useState(true)
    const [shows, setShows] = useState([]);
    useEffect(() => {
        fetch("https://broadwaycommunity-backend.vercel.app/api/shows")
        .then((response) => response.json())
        .then((data) => {
            setShows(data);
            setLoading(false);
        });
    }, []);

    const [searchTerm, setSearchTerm] = useState("")
    
    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value)
    }
    

    const filteredShows = shows.filter(show => {
        return (
            show && 
            show.name &&
            show.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    })
    // console.log(filteredShows)

    return (
        // <Container disableGutters sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 2 }}>
        //     {/* <Typography variant="h2"> Welcome to the Broadway Community </Typography> */}
        //     <h1 className="home__title">Welcome to the Broadway Community</h1>
        //     <Typography variant="h3"> Making Broadway Affordable </Typography>
        //     <Slider shows={shows}/>
        //     {/* <Table shows={shows}/> */}

        // </Container>

        <section className="home section" id="home">
            <div className="home__container container grid">
                <div className="home__content grid">
                    <div className="home__data">
                        <h1 className="home__title">Welcome to the Broadway Community
                        </h1>
                        <h3 className="home__subtitle">Making Broadway Affordable</h3>
                        <p className="home__description">Below you will see the cheapest available ticket for each Broadway show on Stubhub. Note that each ticket will cost an additional 15-20% for Stubhub's fee.</p>
                        <Search searchTerm={searchTerm} handleSearchTerm={handleSearchTerm}/>
                        {!loading
                            ?
                                <Slider shows={filteredShows}/>
                            :
                                <ShowSkeleton />
                        }
                        {/* <Table shows={shows}/> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home