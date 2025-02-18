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
import List from "../list/List";


function Date() {
  const { backendUrl } = useOutletContext();
  
  const [loading, setLoading] = useState(false);
  const [shows, setShows] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [showFees, setShowFees] = useState(true);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setError(null);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setError(null);
  };

  const [category, setCategory] = useState("Broadway");
  const handleSetCategory = (event) => {
    setCategory(event.target.value);
    setShows([]);
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
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    setLoading(true);
    setError(null);
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
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
        if (Array.isArray(data)) {
            // Transform the data to match the expected format
            const transformedShows = data.map(show => ({
                ...show,
                event_info: show.event_info || [],
                id: show.id,
                name: show.name,
                category_id: show.category_id,
                image: show.image,
                venue: show.venue
            }));
            
            const sortedShows = transformedShows.sort((a, b) => {
                const priceA = a?.event_info?.[0]?.price || 0;
                const priceB = b?.event_info?.[0]?.price || 0;
                return priceA - priceB;
            });
            
            console.log("Transformed shows:", sortedShows); // Debug log
            setShows(sortedShows);
        } else {
            console.error("Received non-array data:", data);
            setError("Received invalid data from server");
            setShows([]);
        }
        setLoading(false);
    })
    .catch((error) => {
      console.error("Error refreshing data:", error);
      setError("Failed to fetch show data");
      setShows([]);
      setLoading(false);
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTerm = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  let filteredShows = [];
  if (shows && Array.isArray(shows)) {
    filteredShows = shows.filter((show) => {
      if (!show || !show.event_info || !show.event_info[0]) return false;
      
      return (
        show.event_info[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }
  
  const [individualLoading, setIndividualLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const refreshIndividualData = (id) => {
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
//         setShows((prevShows) => ({
//           ...prevShows,
//           event: prevShows.event.map((show) =>
//             show.id !== updatedShow.event_id
//               ? show
//               : {
//                   ...show,
//                   event_info: [updatedShow],
//                   event_alerts: updatedShow.event.event_alerts,
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
              <strong>additional ~30% for Stubhub's fee.</strong>{" "}
              <span className="date__fee-control">
                <button 
                  className={`date__fee-toggle ${showFees ? 'active' : ''}`}
                  onClick={() => setShowFees(!showFees)}
                  aria-label={showFees ? 'Hide fees' : 'Show fees'}
                />
                <span className="date__fee-label">{showFees ? 'With Fees' : 'Before Fees'}</span>
              </span>
            </p>

            <div className="date__filters">
              <div className="date__top-filters">
                {/* <Search
                  searchTerm={searchTerm}
                  handleSearchTerm={handleSearchTerm}
                /> */}
                <button className="date__refresh-button" onClick={refreshData}>See Prices</button>
              </div>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: "1rem", justifyContent: "center", flexDirection: "column" }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!error && !startDate}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!error && !endDate}
                  />
                </Box>
                {error && (
                  <Box sx={{ color: 'error.main', mt: 1 }}>
                    {error}
                  </Box>
                )}
              </Box>
            </div>

            {!loading ? (
              <>
                {shows.length > 0 ? (
                  <>
                    {/* <h2 className="date__featured-title">Featured Deals</h2>
                    <Slider
                      shows={shows}
                      refreshIndividualData={refreshIndividualData}
                      individualLoading={individualLoading}
                      loadingId={loadingId}
                      showFees={showFees}
                    /> */}

                    <div className="date__list-container">
                      <List 
                        shows={shows}
                        refreshIndividualData={refreshIndividualData}
                        individualLoading={individualLoading}
                        loadingId={loadingId}
                        showFees={showFees}
                      />
                    </div>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    {error ? null : "Select dates and click 'See Prices' to view available shows"}
                  </Box>
                )}
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
