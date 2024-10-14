import React from 'react'
import "./slider.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Mousewheel, FreeMode, Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

const Slider = ({ shows }) => {
    return (
      <section className="slider container section" id='slider'>
        {/* <h2 className="section__title">Shows</h2> */}
        {/* <span className="section__subtitle">What Makes Me... Me </span> */}

        <Swiper className="slider__container"
            modules={[ Mousewheel, FreeMode, Pagination ]}
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
            pagination={{ clickable: true, }}
        >
            {shows && shows.map((show) => {
                return (
                  show.event_info[0] && <SwiperSlide className='slider__card' key={show.id}>
                      {!(show.category_id === 1) && <p className="slider__description-subheader">{show.name}</p>}
                      {/* <img src={show.image} alt="" className="slider__img" /> */}
                      
                      <h3 className="slider__name">{show.event_info[0]?.name}
                          <i className={show.image}></i>
                      </h3>
                      <p className="slider__description-price">${show.event_info[0]?.price}</p>
                      <p className="slider__description-theater">{show.venue?.name}</p>
                      <p className="slider__description-date">{show.event_info[0]?.formatted_date}</p>
                      
                      <a href={show.event_info[0]?.link} className="slider__button" target="_blank" rel="noopener noreferrer">
                          Buy Now <i className="bx bx-right-arrow-alt slider__button-icon"></i>
                      </a>
                      
                  </SwiperSlide>
                )
            })}
        </Swiper>
      </section>
    )
}

export default Slider