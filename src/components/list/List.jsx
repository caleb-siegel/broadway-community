import React, { useState, useEffect } from "react";
import "./list.css";
import { useOutletContext, useNavigate } from "react-router-dom";

const getDiscountClass = (discount) => {
  if (discount >= 15) return 'list__discount-chip--negative';
  if (discount >= 0) return null;  // Don't show chip for small increases
  if (discount >= -25) return 'list__discount-chip--low';
  if (discount >= -50) return 'list__discount-chip--medium';
  return 'list__discount-chip--high';
};

const formatDiscountText = (discount) => {
  const absDiscount = Math.abs(discount);
  return `${Math.round(absDiscount)}% ${discount > 0 ? 'Above' : 'Below'} Avg`;
};

const formatUpdatedTime = (timestamp) => {
  if (!timestamp) return 'Never';
  
  try {
    // If the timestamp already includes "ET", it's from our backend
    if (typeof timestamp === 'string' && timestamp.includes('ET')) {
      return timestamp;
    }

    // For ISO timestamps (from new Date().toISOString())
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Convert to ET
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    };
    return date.toLocaleString('en-US', options) + ' ET';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const List = ({ shows, refreshIndividualData, individualLoading, loadingId, showFees }) => {
  const { backendUrl } = useOutletContext();
  const navigate = useNavigate();

  const [todaytixPrice, setTodaytixPrice] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareId, setCompareId] = useState(0);
  const [updatedTimes, setUpdatedTimes] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleRefresh = async (e, id) => {
    e.stopPropagation();
    refreshIndividualData(id);
    setUpdatedTimes({
      ...updatedTimes,
      [id]: new Date().toISOString()
    });
  };

  const fetchTodayTix = (e, id) => {
    e.stopPropagation();
    setCompareId(id === compareId ? 0 : id);
    setCompareLoading(true);
    fetch(`${backendUrl}/api/fetch_todaytix/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTodaytixPrice(data["today_tix_price"]);
        setCompareLoading(false);
      });
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setCompareId(0);
  };

  const handleBuyClick = (e, link) => {
    e.stopPropagation();
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="list__container">
      {shows && shows
        .filter((show) => !show.closed)
        .map((show) => {
          const discount = show.event_info[0]?.price && show.event_info[0]?.average_lowest_price ? 
            ((show.event_info[0]?.price - show.event_info[0]?.average_lowest_price) / show.event_info[0]?.average_lowest_price) * 100 : null;

          const displayPrice = showFees ? 
            Math.floor(show.event_info[0]?.price * 1.32) : 
            show.event_info[0]?.price;

          const discountClass = getDiscountClass(discount);

          return show.event_info[0] && (
            <div 
              key={show.id} 
              className="list__item"
              onClick={() => navigate(`/event/${show.id}`)}
            >
              {show.category_id === 1 && (
                <div className="list__image-container">
                  <img src={show.image} alt={show.name} className="list__image" />
                </div>
              )}

              <div className="list__main-section">
                <h3 className="list__title">
                  {show.event_info[0]?.name}
                </h3>
                {show.category_id !== 1 && (
                  <div className="list__category-name">
                    {show.name}
                  </div>
                )}
              </div>

              <div className="list__info-section">
                <div className="list__price-date-section">
                  <div className="list__price-refresh">
                    <div className="list__price">
                      {individualLoading && show.id === loadingId ? (
                        <div className="list__price-loading" />
                      ) : (
                        `${showFees ? '~' : ''}$${displayPrice}`
                      )}
                    </div>
                    <button 
                      className={`list__update-btn ${individualLoading && show.id === loadingId ? 'loading' : ''}`}
                      onClick={(e) => handleRefresh(e, show.id)}
                      title="Update price"
                      disabled={individualLoading && show.id === loadingId}
                    >
                      <i className="bx bx-refresh"></i>
                    </button>
                  </div>
                  <div className="list__date">
                    {individualLoading && show.id === loadingId ? "..." : show.event_info[0]?.formatted_date}
                  </div>
                </div>

                <div className="list__actions-section">
                  {discountClass && (
                    <div className={`list__discount-chip ${discountClass}`}>
                      {formatDiscountText(discount)}
                    </div>
                  )}
                  {show.category_id === 1 && (
                    <div style={{ position: 'relative' }}>
                      <button 
                        className={`list__action-btn ${compareId === show.id ? 'active' : ''}`}
                        onClick={(e) => fetchTodayTix(e, show.id)}
                      >
                        Compare Prices
                      </button>
                      {compareId === show.id && (
                        <div className="list__price-comparison-modal" onClick={(e) => e.stopPropagation()}>
                          <button onClick={closeModal} className="list__modal-close">
                            <i className='bx bx-x'></i>
                          </button>
                          {compareLoading ? (
                            <div className="list__price-loading" />
                          ) : (
                            <>
                              <div className="list__price-comparison-row">
                                <span>Stubhub w/fees:</span>
                                <strong>${Math.floor(show.event_info[0]?.price * 1.32)}</strong>
                              </div>
                              <div className="list__price-comparison-row">
                                <span>TodayTix price:</span>
                                <strong>${todaytixPrice}</strong>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => handleBuyClick(e, show.event_info[0]?.link)}
                className="list__buy-button"
              >
                Buy Now{" "}
                <i className="bx bx-right-arrow-alt slider__button-icon"></i>
              </button>

              <div className="list__updated-at">
                Updated {formatUpdatedTime(updatedTimes[show.id] || show.event_info[0]?.updated_at)}
              </div>
            </div>
          );
        })}
      
      {showScrollTop && (
        <button 
          className="list__scroll-top"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <i className='bx bx-up-arrow-alt'></i>
        </button>
      )}
    </div>
  );
};

export default List;