import React from "react";
import { useState } from "react";
import "./slider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import {
  Mousewheel,
  FreeMode,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
} from "swiper/modules";

const Slider = ({ shows }) => {
  const [localShows, setLocalShows] = useState(shows);
  //   const generateWhatsAppLink = (show) => {
  //     const message = `${show.event_info[0]?.name}: $${show.event_info[0]?.price}
  // ${show.event_info[0]?.formatted_date}
  // ${show.event_info[0]?.link}`;

  //     // Encode the message for WhatsApp URL
  //     return `https://wa.me/?text=${encodeURIComponent(message)}`;
  //     };

  const refreshData = (id) => {
    console.log("fetch is running");
    // setLoading(true);
    fetch(
      `https://broadwaycommunity-backend.vercel.app/api/fetch_ticket/${id}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((updatedShowArray) => {
        const updatedShow = updatedShowArray[0];
        console.log(shows);
        console.log(updatedShow);

        setLocalShows((prevShows) =>
          prevShows.map((show) =>
            show.id !== updatedShow.event_id
              ? show
              : {
                  category_id: updatedShow.event.category_id,
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
          )
        );
      })
      .catch((error) => {
        console.error("Error refreshing data:", error);
        // setLoading(false);
      });
  };

  return (
    <section className="slider container section" id="slider">
      {/* <h2 className="section__title">Shows</h2> */}
      {/* <span className="section__subtitle">What Makes Me... Me </span> */}

      <Swiper
        className="slider__container"
        modules={[Mousewheel, FreeMode, Pagination]}
        spaceBetween={24}
        slidesPerView={2}
        // autoHeight={false}
        freeMode={true}
        // loop={true}
        grabCursor={true}
        centeredSlides={true}
        mousewheel={true}
        breakpoints={{
          350: {
            slidesPerView: 1.5,
            spaceBetween: 24,
          },
          576: {
            slidesPerView: 1.5,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 48,
          },
        }}
        pagination={{ clickable: true }}
      >
        {localShows &&
          localShows.map((show) => {
            return (
              show.event_info[0] && (
                <SwiperSlide className="slider__card" key={show.id}>
                  {!(show.category_id === 1) && (
                    <p className="slider__description-subheader">{show.name}</p>
                  )}
                  {/* <img src={show.image} alt="" className="slider__img" /> */}

                  <h3 className="slider__name">
                    {show.event_info[0]?.name}
                    <i className={show.image}></i>
                    <button
                      className="slider__refresh-button"
                      onClick={() => refreshData(show.id)}
                    >
                      {" "}
                      <i className="bx bx-refresh home__refresh-button-icon"></i>
                    </button>
                    {/* <a
                                  href={generateWhatsAppLink(show)}
                                  className="slider__button slider__button--whatsapp"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                    Share <i class='bx bx-share'></i>
                                </a> */}
                  </h3>
                  <p className="slider__description-price">
                    ${show.event_info[0]?.price}
                  </p>
                  {/* <p className="slider__description-theater">
                    {show.venue?.name}
                  </p> */}
                  <p className="slider__description-date">
                    {show.event_info[0]?.formatted_date}
                  </p>

                  <a
                    href={show.event_info[0]?.link}
                    className="slider__button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy Now{" "}
                    <i className="bx bx-right-arrow-alt slider__button-icon"></i>
                  </a>
                </SwiperSlide>
              )
            );
          })}
      </Swiper>
    </section>
  );
};

export default Slider;
