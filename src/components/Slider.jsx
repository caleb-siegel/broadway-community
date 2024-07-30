import React, { useState } from 'react';
import { Card, CardHeader, CardMedia, Chip, Container, IconButton, Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShowCard from './ShowCard';
import { useSwipeable } from 'react-swipeable';


function Slider({ shows }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shows.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + shows.length) % shows.length);
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
      });
    
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Box {...handlers} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handlePrev} disabled={shows.length <= 1}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Box>
                    <ShowCard show={shows[currentIndex]} />
                </Box>
                <IconButton onClick={handleNext} disabled={shows.length <= 1}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2">
                    {currentIndex + 1} / {shows.length}
                </Typography>
            </Box>
        </Container>
    );
}

export default Slider;