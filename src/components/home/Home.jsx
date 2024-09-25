import React, { useState, useEffect } from 'react'
import { Container, Typography } from '@mui/material'
import Table from '../table/Table'
import Slider from '../slider/Slider'
import "./home.css";
import Search from '../search/Search';
import ShowSkeleton from './ShowSkeleton';
import Filter from '../filter/Filter';


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
        fetch("http://127.0.0.1:5000/api/shows")
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
    
    let filteredShows = shows
    
    const [active, setActive] = useState("all");

    const handleActive = (event) => {
        setActive(event.target.value)
    }
    
    const today = new Date();
    if (active === "all") {
        filteredShows = filteredShows
    } else if (active === "today") {
        filteredShows = shows.filter(show => {
            const showDate = new Date(show.start_date);
            return showDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
        });    
    } else if (active === "7days") {
        filteredShows = shows.filter(show => {
            const showDate = new Date(show.start_date);
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return showDate.toISOString().split('T')[0] >= today.toISOString().split('T')[0] && showDate.toISOString().split('T')[0] <= nextWeek.toISOString().split('T')[0];
        });
    }
    
    filteredShows = filteredShows.filter(show => {
        return (
            show && 
            show.name &&
            show.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    })

    // const handleActive = (event) => {
    //     setActive(event.target.value)
    //     filterDate(active)
    // }

    // const filterDate = (filter) => {
    //     active && console.log(active)
    //     const today = new Date();
    //     if (active === "all") {
    //         filteredShows = shows;
    //     } else if (active && active === "today") {
    //         filteredShows = shows.filter(show => {
    //             const showDate = new Date(show.start_date);
    //             return showDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    //         });
    //     } else if (active && active === "7days") {
    //         const nextWeek = new Date();
    //         const today = new Date();
    //         nextWeek.setDate(today.getDate() + 7);
    //         console.log(nextWeek)
        
    //         filteredShows = shows.filter(show => {  
    //             const showDate = new Date(show.start_date);
    //             return (
    //                 showDate >= today && showDate <= nextWeek
    //             );
    //         });
    //     }
    // }

    return (
        <section className="home section" id="home">
            <div className="home__container container grid">
                <div className="home__content grid">
                    <div className="home__data">
                        <h1 className="home__title">Welcome to the Broadway Community
                        </h1>
                        <h3 className="home__subtitle">Making Broadway Affordable</h3>
                        <p className="home__description">Below you will see the cheapest available ticket for each Broadway show on Stubhub. Note that each ticket will cost an additional ~30% for Stubhub's fee.</p>
                        <div className="home__filters">
                            <Search searchTerm={searchTerm} handleSearchTerm={handleSearchTerm}/>
                            <Filter active={active} handleActive={handleActive} />
                        </div>
                        
                        {!loading
                            ?
                                <Slider shows={filteredShows}/>
                            :
                                <ShowSkeleton />
                        }
                        {/* <Table shows={filteredShows}/> */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home