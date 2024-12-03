import React from 'react';
import { 
  Backdrop, 
  CircularProgress, 
  Typography, 
  Box, 
  Container 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TheaterMasksIcon from '@mui/icons-material/Masks'; // Theater mask icon

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  
  zIndex: theme.zIndex.drawer + 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LoadingSpinner = () => {
  return (
    <StyledBackdrop open={true}>
      <Container maxWidth="xs">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            color: 'white'
          }}
        >
          {/* <TheaterMasksIcon 
            sx={{ 
              fontSize: 100, 
              color: 'primary.light',
              marginBottom: 2 
            }} 
          /> */}
          <CircularProgress 
            color="primary" 
            size={80} 
            thickness={4} 
            sx={{ marginBottom: 2 }}
          />
          <Typography variant="h5" color="inherit">
            Loading User Info
          </Typography>
        </Box>
      </Container>
    </StyledBackdrop>
  );
};

export default LoadingSpinner;