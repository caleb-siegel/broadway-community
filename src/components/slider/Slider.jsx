import React from "react";
import { useState } from "react";
import "./slider.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Mousewheel, FreeMode, Navigation, Pagination, Scrollbar, A11y, } from "swiper/modules"; 
import { useOutletContext, useNavigate } from "react-router-dom";

const getDiscountClass = (discount) => {
  if (discount >= 15) return 'slider__price-flag--negative';
  if (discount >= 0) return null;  // Don't show chip for small increases
  if (discount >= -25) return 'slider__price-flag--low';
  if (discount >= -50) return 'slider__price-flag--medium';
  return 'slider__price-flag--high';
};

const formatDiscountText = (discount) => {
  const absDiscount = Math.abs(discount);
  return `${Math.round(absDiscount)}% ${discount > 0 ? 'Above' : 'Below'} Avg`;
};

const Slider = ({ shows, refreshIndividualData, individualLoading, loadingId }) => {
  //   const generateWhatsAppLink = (show) => {
  //     const message = `${show.event_info[0]?.name}: $${show.event_info[0]?.price}
  // ${show.event_info[0]?.formatted_date}
  // ${show.event_info[0]?.link}`;

  //     // Encode the message for WhatsApp URL
  //     return `https://wa.me/?text=${encodeURIComponent(message)}`;
  //     };

  const { backendUrl } = useOutletContext();
  const navigate = useNavigate();

  const [todaytixPrice, setTodaytixPrice] = useState(null)
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareId, setCompareId] = useState(0)
  const fetchTodayTix = (e, id) => {
    e.stopPropagation();
    setCompareId(id)
    setCompareLoading(true)
    fetch(`${backendUrl}/api/fetch_todaytix/${id}`)
    .then((response) => response.json())
    .then((data) => {
      setTodaytixPrice(data["today_tix_price"]);
      setCompareLoading(false)
    })
  }

  const handleRefresh = (e, id) => {
    e.stopPropagation();
    refreshIndividualData(id);
  };

  const handleBuyClick = (e, link) => {
    e.stopPropagation();
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="slider container section" id="slider">
      {/* <h2 className="section__title">Shows</h2> */}
      {/* <span className="section__subtitle">What Makes Me... Me </span> */}

      <Swiper
        className="slider__container"
        modules={[Mousewheel, FreeMode, Pagination, Navigation]}
        spaceBetween={24}
        slidesPerView={3}
        // autoHeight={false}
        freeMode={true}
        // loop={true}
        grabCursor={true}
        // centeredSlides={true}
        mousewheel={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        breakpoints={{
          350: {
            slidesPerView: 1.25,
            spaceBetween: 24,
          },
          576: {
            slidesPerView: 1.25,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 48,
          },
        }}
        pagination={{ clickable: true }}
      >
        {shows &&
          shows
          .filter((show) => !show.closed)
          .map((show) => {
            const discount = show.event_info[0]?.price && show.event_info[0]?.average_lowest_price ? 
              ((show.event_info[0]?.price - show.event_info[0]?.average_lowest_price) / show.event_info[0]?.average_lowest_price) * 100 : null;

            const displayPrice = show.event_info[0]?.price;

            const discountClass = getDiscountClass(discount);

            return (
              show.event_info[0] && (
                <SwiperSlide 
                  className="slider__card" 
                  key={show.id}
                  onClick={() => navigate(`/event/${show.id}`)}
                >
                  {discountClass && (
                    <div className="slider__price-flag">
                      <div className="slider__price-flag-content">
                        <div className={`slider__price-flag-main ${discountClass}`}>
                          {formatDiscountText(discount)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  
                    <div className="slider__description-subheader">{(show.event_info[0]?.name === show.name) || (show.category_id === 1) ? <span>&nbsp;</span> : show.name}</div>
                  
                  <img src={show.image} alt="" className="slider__img" />

                  <h3 className="slider__name">
                    {show.event_info[0]?.name}
                    {/* <i className={show.image}></i> */}
                    <button
                      className="slider__refresh-button"
                      onClick={(e) => handleRefresh(e, show.id)}
                    >
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
                    {" "}
                    {individualLoading && show.id === loadingId
                      ? "..."
                      : `$${displayPrice}`}
                  </p>
                  {(show.category_id !== 1) ? 
                    <p className="slider__description-theater">{show.venue?.name}</p>
                  : ""}
                  <p className="slider__description-date">
                    {" "}
                    {individualLoading && show.id === loadingId
                      ? "..."
                      : show.event_info[0]?.formatted_date}
                  </p>

                  {/* <p className="slider__description-location">
                    {" "}
                    {individualLoading && show.id === loadingId
                      ? "..."
                      : `${show.event_info[0]?.location} ${show.event_info[0]?.row}`}
                  </p>

                  <p className="slider__description-quantity">
                    {" "}
                    {individualLoading && show.id === loadingId
                      ? "..."
                      : `${show.event_info[0]?.quantity} seats`}
                  </p>

                  <p className="slider__description-quantity">
                    {" "}
                    {individualLoading && show.id === loadingId
                      ? "..."
                      : `${show.event_info[0]?.note}`}
                  </p> */}
                  <br/>

                  <button
                    onClick={(e) => handleBuyClick(e, show.event_info[0]?.link)}
                    className="slider__button"
                  >
                    {individualLoading && show.id === loadingId ? (
                      "Loading"
                    ) : (
                      <>
                        Buy Now{" "}
                        <i className="bx bx-right-arrow-alt slider__button-icon"></i>
                      </>
                    )}
                    {/* <i className="bx bx-right-arrow-alt slider__button-icon"></i> */}
                  </button>
                  <br/>
                  <br/>
                  {(show.category_id === 1) ? <button className="slider__price-compare" onClick={(e) => fetchTodayTix(e, show.id)} >Price Compare</button> : ""}
                  <br/>
                  {(compareId === show.id) ?
                  (!compareLoading ? 
                    todaytixPrice && 
                      <>
                      <div className="slider__comparisons">Stubhub: ${show.event_info[0]?.price}</div>
                      <div className="slider__comparisons">TodayTix price: ${todaytixPrice}</div>
                      </>

                  : "Loading")
                  : ""
                  }
                </SwiperSlide>
              )
            );
          })}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </Swiper>
    </section>
  );
};

export default Slider;
