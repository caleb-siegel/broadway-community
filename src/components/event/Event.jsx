import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const Event = () => {
    
    const { id } = useParams();

    const [event, setEvent] = useState([]);
    useEffect(() => {
        fetch(`https://broadwaycommunity-backend.vercel.app/api/events/${id}`)
        .then((response) => response.json())
        .then((data) => setEvent(data));
    }, []);
    console.log(event)

    const [todaytixPrice, setTodaytixPrice] = useState(0)
    useEffect(() => {
        fetch(`https://broadwaycommunity-backend.vercel.app/api/fetch_todaytix/${id}`)
        .then((response) => response.json())
        .then((data) => setTodaytixPrice(data["today_tix_price"]));
    }, []);

    // const fetchTodayTix = () => {
    //     console.log("hi")
    //     fetch(`https://broadwaycommunity-backend.vercel.app/api/fetch_todaytix/${id}`)
    //     .then((response) => response.json())
    //     .then((data) => setTodaytixPrice(data));
    // }
    
    return (
        <>
            <div>Show</div>
            <div>{1}</div> {/* just so its lower down on the page until i fix the styling */}
            <div>{2}</div> {/* just so its lower down on the page until i fix the styling */}
            
            <div>{event.name}</div>
            <div>Stubhub Price: ${event?.event_info?.[0]?.price}</div>
            <div>TodayTix Price: ${todaytixPrice}</div>
        </>
    )
}

export default Event