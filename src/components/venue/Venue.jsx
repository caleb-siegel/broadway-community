import React, { useState, useEffect } from "react";
// import Table from "../table/Table";
// import Slider from "../slider/Slider";
// import "./home.css";
// import Search from "../search/Search";
// import ShowSkeleton from "./ShowSkeleton";
// import Filter from "../filter/Filter";
// import Categories from "../categories/Categories";
// import List from "../list/List";
import { useOutletContext } from "react-router-dom";
import { toast } from 'react-toastify';
import List from "../list/List";

const Venue = () => {
    const { backendUrl } = useOutletContext();
    console.log("Backend URL:", backendUrl);

    const [loading, setLoading] = useState(true);
    const [shows, setShows] = useState([]);
    console.log("hi")
    const [region, setRegion] = useState("NewYork");
    
    
    useEffect(() => {
        fetch(
            `${backendUrl}/api/fetch_tickets_venues/${region}`
        )
            .then((response) => response.json())
            .then((data) => {
                setShows(data);
                console.log("hi")
                console.log(data)
                setLoading(false);
            });
        }, [region]);


    return (
        <div>
            {loading && (
                <div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    Loading...
                </div>
            )}
    
            {!loading && shows && (
                <div>
                    <div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                    {shows?.map((show) => {
                        return (
                            <div key={show.name}>
                                {show.name}: ${show.price}
                                <br/>
                                {show.formatted_date}
                                <br/>
                                {show.venue}
                                <br/>
                                <a href={show.link} target="_blank" rel="noopener noreferrer">
                                    {show.link}
                                </a>
                                <br/>
                                <br/>
                            </div>
                        );
                    })}
                    {/* <List 
                        shows={shows} 
                        refreshIndividualData={() => {}}
                        individualLoading={false}
                        loadingId={loading}
                    /> */}
                </div>
            )}
        </div>
    );
}

export default Venue