import React from 'react';
import { Box, Typography } from '@mui/material';


function HeroBanner() {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '500px',
                backgroundImage: 'url(https://media.istockphoto.com/id/1425270229/vector/theater-empty-stage-with-red-curtains-spotlights.jpg?s=612x612&w=0&k=20&c=URNPC0J5-oWLt0MMEcpViYpHwGmfH0Pv6E3vQsXvPc0=)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                textAlign: 'center',
            }}
        >
            <Box sx={{ position: 'relative', zIndex: 1, }}>
                <Typography variant="h2" gutterBottom sx={{ color: 'primary.main' }}> Welcome to the Broadway Community </Typography>
                <Typography variant="h3" gutterBottom sx={{ color: 'primary.main' }}> Making Broadway Affordable </Typography>
            </Box>
        </Box>
    )
}

export default HeroBanner