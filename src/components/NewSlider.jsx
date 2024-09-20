import React from 'react'
import "./newslider.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

const NewSlider = ({ shows }) => {
    return (
      <section className="slider container section" id='slider'>
        {/* <h2 className="section__title">Shows</h2> */}
        {/* <span className="section__subtitle">What Makes Me... Me </span> */}

        <Swiper className="slider__container"
            modules={[ Pagination ]}
            spaceBetween={24}
            slidesPerView={1.3}
            loop={true}
            grabCursor={true}
            centeredSlides={true}
            breakpoints={{
                350: {
                    slidesPerView: 1.7,
                },
                576: {
                    slidesPerView: 1.7,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 48,
                }
            }}
            pagination={{ clickable: true }}
        >
            {shows.map((show) => {
                return (
                  <SwiperSlide className='slider__card' key={show.id}>
                      <img src={show.image} alt="" className="slider__img" />

                      <h3 className="slider__name">{show.name}
                          <i className={show.image}></i>
                      </h3>
                      <p className="slider__description">${show.price}</p>
                      
                      {/* <a href={show.row} className="slider__button" target="_blank" rel="noopener noreferrer">
                          {show.row} <i className="bx bx-right-arrow-alt slider__button-icon"></i>
                      </a> */}
                      
                  </SwiperSlide>
                )
            })}
        </Swiper>
      </section>
    )
}

export default NewSlider