import React, { useState, useEffect } from "react";
import Table from "../table/Table";
import Slider from "../slider/Slider";
import "./home.css";
import Search from "../search/Search";
import ShowSkeleton from "./ShowSkeleton";
import Filter from "../filter/Filter";
import Categories from "../categories/Categories";
import List from "../list/List";
import { useOutletContext } from "react-router-dom";

function Home() {
  const { backendUrl } = useOutletContext();
  
  const [loading, setLoading] = useState(true);
  const [shows, setShows] = useState([]);

  const [category, setCategory] = useState("Broadway");
  const handleSetCategory = (event) => {
    setCategory(event.target.value);
    setLoading(true);
  };

  useEffect(() => {
    fetch(
      `${backendUrl}/api/categories/${category}`
    )
      .then((response) => response.json())
      .then((data) => {
        setShows(data);
        setLoading(false);
      });
  }, [category]);

  const refreshData = () => {
    console.log("fetch is running");
    setLoading(true);
    fetch(
      `${backendUrl}/api/fetch_tickets/${category}`,
      {
        method: "POST",
      }
    )
    .then((response) => response.json())
    .then(() => {
      fetch(`${backendUrl}/api/categories/${category}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setShows(data);
        setLoading(false);
      });
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

  let filteredShows = shows.event;
  if (shows?.event?.length > 1) {
    filteredShows = shows?.event?.sort(
      (a, b) => a?.event_info[0]?.price - b?.event_info[0]?.price
    );
  }

  const [active, setActive] = useState("all");

  const handleActive = (event) => {
    event.preventDefault();
    setActive(event.target.value);
  };

  if (active === "all") {
    filteredShows = shows.event;
  } else if (active === "today") {
    const now = new Date();
    // Convert current time to Eastern Time
    const utcOffset = now.getTimezoneOffset(); // Local timezone offset in minutes
    const etOffset = -5 * 60; // Eastern Time offset in minutes (Standard Time; adjust to -4 * 60 for Daylight Saving Time)
    const etTime = new Date(now.getTime() + (etOffset - utcOffset) * 60 * 1000);

    const todayET = etTime.toISOString().split("T")[0];

    filteredShows = filteredShows?.filter((show) => {
      const showDate = show?.event_info[0]?.event_date;
      if (!showDate) {
        console.error("Invalid date:", showDate);
        return false;
      }
      return showDate === todayET;
    });
  } else if (active === "7days") {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const formattedSevenDaysFromNow = sevenDaysFromNow
      .toISOString()
      .split("T")[0];

    filteredShows = filteredShows?.filter((show) => {
      const showDate = show?.event_info[0]?.event_date;
      if (!showDate) {
        console.error("Invalid date:", showDate);
        return false;
      }
      return showDate <= formattedSevenDaysFromNow;
    });
  } else if (active === "cheapest") {
    filteredShows = filteredShows.sort(
      (a, b) => a.event_info[0].price - b.event_info[0].price
    );
  }

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

  const [individualLoading, setIndividualLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const refreshIndividualData = (id) => {
    console.log("fetch is running");
    setIndividualLoading(true);
    setLoadingId(id);
    fetch(
      `${backendUrl}/api/fetch_ticket/${id}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((updatedShowArray) => {
        const updatedShow = updatedShowArray[0];
        console.log(updatedShow);
        setShows((prevShows) => ({
          ...prevShows,
          event: prevShows.event.map((show) =>
            show.id !== updatedShow.event_id
              ? show
              : {
                  ...show,
                  event_info: [updatedShow],
                  event_preferences: updatedShow.event.event_preferences,
                  id: updatedShow.event.id,
                  image: updatedShow.event.image,
                  lottery_url: updatedShow.event.lottery_url,
                  name: updatedShow.event.name,
                  show_duration: updatedShow.event.show_duration,
                  stubhub_category_id: updatedShow.event.stubhub_category_id,
                  venue: updatedShow.event.venue,
                  venue_id: updatedShow.event.venue_id,
                }
          ),
        }));
        setIndividualLoading(false);
        setLoadingId(null);
      })
      .catch((error) => {
        console.error("Error refreshing individual show data:", error);
      });
  };

  return (
    <section className="home section" id="home">
      <div className="home__container container grid">
        <div className="home__content grid">
          <div className="home__data">
            {/* <h1 className="home__title">Attend the Event for Cheap</h1> */}
            <h1 className="home__title">
              Find Tickets To
              <Categories
                category={category}
                handleSetCategory={handleSetCategory}
              />
            </h1>
            <p className="home__description">
              Find the cheapest available ticket on Stubhub for each event
              listed below. Note that each ticket will cost an{" "}
              <strong>additional ~30% for Stubhub's fee.</strong>
            </p>

            <div className="home__filters">
              <div className="home__top-filters">
                <Search
                  searchTerm={searchTerm}
                  handleSearchTerm={handleSearchTerm}
                />
                <button className="home__refresh-button" onClick={refreshData}>
                  {" "}
                  <i class="bx bx-refresh home__refresh-button-icon"></i>{" "}
                  Refresh Data
                </button>
              </div>
              <Filter active={active} handleActive={handleActive} />
            </div>

            {!loading ? (
              <>
                <Slider
                  shows={filteredShows}
                  refreshIndividualData={refreshIndividualData}
                  individualLoading={individualLoading}
                  loadingId={loadingId}
                />
                {/* <List 
                  shows={filteredShows}
                  refreshIndividualData={refreshIndividualData}
                  individualLoading={individualLoading}
                  loadingId={loadingId}
                /> */}
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

export default Home;
