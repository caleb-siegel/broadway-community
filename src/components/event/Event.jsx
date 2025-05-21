import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button,
  Grid,
  Tooltip,
  Divider,
} from '@mui/material';
import { 
  LocationOn,
  OpenInNew,
  TheaterComedy,
  AccessTime,
  CalendarToday,
  TrendingUp
} from '@mui/icons-material';
import './event.css';

const Event = () => {
  const { id } = useParams();
  const { backendUrl } = useOutletContext();
  const [event, setEvent] = useState(null);
  const [todaytixPrice, setTodaytixPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/events/${id}`);
        const data = await response.json();
        setEvent(data);
        
        const todaytixResponse = await fetch(`${backendUrl}/api/fetch_todaytix/${id}`);
        const todaytixData = await todaytixResponse.json();
        setTodaytixPrice(todaytixData["today_tix_price"]);
      } catch (error) {
        console.error('Error fetching event data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, backendUrl]);

  if (loading) {
    return (
      <Box className="event__loading">
        <div className="loading-spinner"></div>
      </Box>
    );
  }

  if (!event) {
    return (
      <Container>
        <Typography variant="h1">Event not found</Typography>
      </Container>
    );
  }

  const latestEventInfo = event.event_info?.[0];
  
  // Calculate price difference percentage
  const calculatePriceDiff = () => {
    if (!latestEventInfo?.price || !latestEventInfo.average_lowest_price) return null;
    const diff = ((latestEventInfo.price - latestEventInfo.average_lowest_price) / latestEventInfo.average_lowest_price) * 100;
    return Math.round(diff);
  };

  const priceDiffPercentage = calculatePriceDiff();

  // Calculate price
  const getDisplayPrice = () => {
    if (!latestEventInfo?.price) return null;
    return latestEventInfo.price;
  };

  const displayPrice = getDisplayPrice();

  return (
    <Container maxWidth="lg" className="event__container">
      <Grid container spacing={4}>
        {/* Left Column - Show Image */}
        <Grid item xs={12} md={6}>
          <div className="event__image-container">
            {event.image ? (
              <img src={event.image} alt={event.name} className="event__image" />
            ) : (
              <div className="event__image-placeholder">
                <TheaterComedy sx={{ fontSize: 60 }} />
              </div>
            )}
          </div>
        </Grid>

        {/* Right Column - Show Details */}
        <Grid item xs={12} md={6}>
          <div className="event__content">
            <Typography variant="h1" className="event__title">
              {event.name}
            </Typography>

            <div className="event__info-section">
              <div className="event__location">
                <div className="event__info-group">
                  {event.venue && (
                    <div className="event__info-row">
                      <LocationOn className="event__icon" />
                      <Typography>{event.venue.name}</Typography>
                    </div>
                  )}
                  {event.category && (
                    <div className="event__info-row">
                      <TheaterComedy className="event__icon" />
                      <Typography>{event.category.name}</Typography>
                    </div>
                  )}
                </div>
                {event.show_duration && (
                  <div className="event__info-row">
                    <AccessTime className="event__icon" />
                    <Typography>{event.show_duration}</Typography>
                  </div>
                )}
              </div>

              <div className="event__prices-section">
                <div className="event__price-header-group">
                  <Typography variant="h2" className="event__section-title">
                    Current Prices
                  </Typography>
                </div>
                
                <div className="event__prices">
                  {displayPrice && (
                    <div className="event__price-box">
                      <div className="event__price-header">StubHub</div>
                      <div className="event__price-amount">${displayPrice}</div>
                      {priceDiffPercentage !== null && (
                        <Tooltip title="Compared to historical average" placement="top">
                          <div className="event__price-diff">
                            <TrendingUp className="event__price-diff-icon" />
                            <span className={priceDiffPercentage > 0 ? 'price-up' : 'price-down'}>
                              {priceDiffPercentage > 0 ? '+' : ''}{priceDiffPercentage}%
                            </span>
                          </div>
                        </Tooltip>
                      )}
                      {latestEventInfo?.formatted_date && (
                        <div className="event__show-details">
                          <CalendarToday className="event__icon" fontSize="small" />
                          <Typography variant="body2">{latestEventInfo.formatted_date}</Typography>
                        </div>
                      )}
                      {latestEventInfo.link && (
                        <Button 
                          variant="contained"
                          endIcon={<OpenInNew />}
                          href={latestEventInfo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="event__view-button"
                        >
                          Buy Now
                        </Button>
                      )}
                    </div>
                  )}

                  {todaytixPrice && (
                    <div className="event__price-box">
                      <div className="event__price-header">TodayTix</div>
                      <div className="event__price-amount">${todaytixPrice}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="event__actions">
                {event.lottery_url && (
                  <Button 
                    variant="outlined"
                    endIcon={<OpenInNew />}
                    href={event.lottery_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event__lottery-button"
                  >
                    Enter Lottery
                  </Button>
                )}

                {event.venue?.seatplan_url && (
                  <Button 
                    variant="outlined"
                    endIcon={<OpenInNew />}
                    href={event.venue.seatplan_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event__venue-button"
                  >
                    View Seat Map
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Event;