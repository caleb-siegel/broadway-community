import React, { useState, useEffect } from "react";
import Table from "../table/Table";
import Slider from "../slider/Slider";
import "./date.css";
import Search from "../search/Search";
import ShowSkeleton from "../home/ShowSkeleton";
import Filter from "../filter/Filter";
import Categories from "../categories/Categories";
import { useOutletContext } from "react-router-dom";
import { TextField, Box } from "@mui/material";


function Date() {
  const { backendUrl } = useOutletContext();
  
  const [loading, setLoading] = useState(false);
  const [shows, setShows] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    // handleActive({ ...active, startDate: event.target.value });
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    // handleActive({ ...active, endDate: event.target.value });
  };

  const [category, setCategory] = useState("broadway");
  const handleSetCategory = (event) => {
    setCategory(event.target.value);
    setLoading(true);
  };

//   useEffect(() => {
//     fetch(
//       `${backendUrl}/api/categories/${category}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         setShows(data);
//         setLoading(false);
//       });
//   }, [category]);

  const refreshData = () => {
    console.log("fetch is running");
    setLoading(true);
    fetch(
      `${backendUrl}/api/fetch_tickets_dates/${category}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
        }),
      }
    )
    .then((response) => response.json())
    .then((data) => {
        setShows(data.sort(
            (a, b) => a?.event_info[0]?.price - b?.event_info[0]?.price
        ));
        setLoading(false);
    })
    .catch((error) => {
      console.error("Error refreshing data:", error);
      setLoading(false);
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTerm = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };
  let filteredShows = [shows]
  if (shows) {
    
    
    filteredShows = filteredShows?.filter((show) => {
        return (
        show &&
        show.name &&
        (show.event_info[0]?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            show.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
  }
  
  const [individualLoading, setIndividualLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const refreshIndividualData = (id) => {
//     console.log("fetch is running");
//     setIndividualLoading(true);
//     setLoadingId(id);
//     fetch(
//       `${backendUrl}/api/fetch_ticket/${id}`,
//       {
//         method: "POST",
//       }
//     )
//       .then((response) => response.json())
//       .then((updatedShowArray) => {
//         const updatedShow = updatedShowArray[0];
//         console.log(updatedShow);
//         setShows((prevShows) => ({
//           ...prevShows,
//           event: prevShows.event.map((show) =>
//             show.id !== updatedShow.event_id
//               ? show
//               : {
//                   ...show,
//                   event_info: [updatedShow],
//                   event_preferences: updatedShow.event.event_preferences,
//                   id: updatedShow.event.id,
//                   image: updatedShow.event.image,
//                   lottery_url: updatedShow.event.lottery_url,
//                   name: updatedShow.event.name,
//                   show_duration: updatedShow.event.show_duration,
//                   stubhub_category_id: updatedShow.event.stubhub_category_id,
//                   venue: updatedShow.event.venue,
//                   venue_id: updatedShow.event.venue_id,
//                 }
//           ),
//         }));
//         setIndividualLoading(false);
//         setLoadingId(null);
//       })
//       .catch((error) => {
//         console.error("Error refreshing individual show data:", error);
//       });
  };

  return (
    <section className="date section" id="date">
      <div className="date__container container grid">
        <div className="date__content grid">
          <div className="date__data">
            {/* <h1 className="date__title">Attend the Event for Cheap</h1> */}
            <h1 className="date__title">
              Find Tickets To
              <Categories
                category={category}
                handleSetCategory={handleSetCategory}
              />
            </h1>
            <p className="date__description">
              Choose a date range and click "See Prices" to find the cheapest available ticket on Stubhub for each event
              listed below in that date range. Note that each ticket will cost an{" "}
              <strong>additional ~30% for Stubhub's fee.</strong>
            </p>

            <div className="date__filters">
              <div className="date__top-filters">
                <Search
                  searchTerm={searchTerm}
                  handleSearchTerm={handleSearchTerm}
                />
                <button className="date__refresh-button" onClick={refreshData}>See Prices</button>
              </div>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
                </Box>
            </div>

            {!loading ? (
              <>
                    <Slider
                    shows={shows}
                    refreshIndividualData={refreshIndividualData}
                    individualLoading={individualLoading}
                    loadingId={loadingId}
                    />
                
            </>
            ) : (
              <ShowSkeleton />
            )}
            {/* <Table shows={filteredShows}/> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Date;
