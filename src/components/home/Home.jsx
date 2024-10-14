import React, { useState, useEffect } from 'react'
import Table from '../table/Table'
import Slider from '../slider/Slider'
import "./home.css";
import Search from '../search/Search';
import ShowSkeleton from './ShowSkeleton';
import Filter from '../filter/Filter';
import Categories from '../categories/Categories';


function Home() {
    const [loading, setLoading] = useState(true)
    const [shows, setShows] = useState([]);

    const [category, setCategory] = useState("broadway")
    const handleSetCategory = (event) => {
        setCategory(event.target.value)
        setLoading(true)
    }

    useEffect(() => {
        fetch(`https://broadwaycommunity-backend.vercel.app/api/categories/${category}`)
        .then((response) => response.json())
        .then((data) => {
            setShows(data);
            setLoading(false);
        });
    }, [category]);
    
    const refreshData = () => {
        console.log("fetch is running")
        setLoading(true);
        fetch(`https://broadwaycommunity-backend.vercel.app/api/fetch_tickets`, {
            method: 'POST',
        })
        .then((response) => response.json())
        .then(() => {
            fetch(`https://broadwaycommunity-backend.vercel.app/api/categories/${category}`)
                .then((response) => response.json())
                .then((data) => {
                    setShows(data);
                    setLoading(false);
                });
        })
        .catch((error) => {
            console.error('Error refreshing data:', error);
            setLoading(false);
        });
    };

    const [searchTerm, setSearchTerm] = useState("")
    
    const handleSearchTerm = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value)
    }
    
    let filteredShows = shows.event
    if (shows?.event?.length > 1) {
        filteredShows = shows?.event?.sort((a, b) => a?.event_info[0]?.price - b?.event_info[0]?.price);
    }
    
    const [active, setActive] = useState("all");

    const handleActive = (event) => {
        event.preventDefault();
        setActive(event.target.value)
    }
    
    if (active === "all") {
        filteredShows = shows.event
    } else if (active === "today") {
        const today = new Date().toISOString().split('T')[0];
        filteredShows = filteredShows?.filter(show => {
            const showDate = show?.event_info[0]?.event_date;
            if (!showDate) {
                console.error("Invalid date:", showDate);
                return false;
            }
            return showDate === today;
        });    
    } else if (active === "7days") {
        const today = new Date();
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);
        const formattedSevenDaysFromNow = sevenDaysFromNow.toISOString().split('T')[0];

        filteredShows = filteredShows?.filter(show => {
            const showDate = show?.event_info[0]?.event_date;
            if (!showDate) {
                console.error("Invalid date:", showDate);
                return false;
            }
            return showDate <= formattedSevenDaysFromNow;
        });
    } else if (active === "cheapest") {
        filteredShows = filteredShows.sort((a, b) => a.event_info[0].price - b.event_info[0].price);
    }
    
    filteredShows = filteredShows?.filter(show => {
        return (
            show && 
            show.name &&
            (
                show.event_info[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                ||
                show.name.toLowerCase().includes(searchTerm.toLowerCase())
            )

        );
    })

    return (
        <section className="home section" id="home">
            <div className="home__container container grid">
                <div className="home__content grid">
                    <div className="home__data">
                        {/* <h1 className="home__title">Attend the Event for Cheap</h1> */}
                        <h1 className="home__title">Find Tickets To  
                            <Categories category={category} handleSetCategory={handleSetCategory}/>
                        </h1>
                        <p className="home__description">Find the cheapest available ticket on Stubhub for each event listed below. Note that each ticket will cost an additional ~30% for Stubhub's fee.</p>
                        
                        <div className="home__filters">
                            
                            <div className='home__top-filters'>
                                
                                <Search searchTerm={searchTerm} handleSearchTerm={handleSearchTerm}/>
                                <button className="home__refresh-button" onClick={refreshData}> <i class='bx bx-refresh home__refresh-button-icon'></i> Refresh Data</button>
                            </div>
                            <Filter active={active} handleActive={handleActive} />
                            
                        </div>
                        
                        {!loading
                            ?
                                <>
                                <Slider shows={filteredShows}/>
                                </>
                                
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