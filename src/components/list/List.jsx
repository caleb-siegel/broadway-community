import React, { useState } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Link, 
  Stack, 
  Chip 
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useOutletContext } from "react-router-dom";

const VerticalSlider = ({ shows, refreshIndividualData, individualLoading, loadingId }) => {
  const { backendUrl } = useOutletContext();

  const [todaytixPrice, setTodaytixPrice] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareId, setCompareId] = useState(0);

  const fetchTodayTix = (id) => {
    setCompareId(id);
    setCompareLoading(true);
    fetch(`${backendUrl}/api/fetch_todaytix/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTodaytixPrice(data["today_tix_price"]);
        setCompareLoading(false);
      });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2, 
      width: '100%', 
      maxWidth: 500 
    }}>
      {shows && shows.map((show) => (
        show.event_info[0] && (
          <Card 
            key={show.id} 
            sx={{ 
              position: 'relative', 
              width: '100%' 
            }}
          >
            {(show.event_info[0]?.price < show.event_info[0]?.average_lowest_price) && (
              <Chip
                label={`${Math.ceil(((show.event_info[0]?.price / show.event_info[0]?.average_lowest_price) - 1) * -100)}% Below Avg`}
                color="success"
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10 
                }}
              />
            )}

            <CardContent>
              <Stack spacing={1}>
                {(show.event_info[0]?.name !== show.name && show.category_id !== 1) && (
                  <Typography variant="caption" color="text.secondary">
                    {show.name}
                  </Typography>
                )}

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <Typography variant="h6">
                    {show.event_info[0]?.name}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => refreshIndividualData(show.id)}
                  >
                    <RefreshIcon />
                  </Button>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  {individualLoading && show.id === loadingId
                    ? "..."
                    : `$${show.event_info[0]?.price}`}
                </Typography>

                {(show.category_id !== 1) && (
                  <Typography variant="body2" color="text.secondary">
                    {show.venue?.name}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  {individualLoading && show.id === loadingId
                    ? "..."
                    : show.event_info[0]?.formatted_date}
                </Typography>

                <Link 
                  href={
                    individualLoading && show.id === loadingId
                      ? "..."
                      : show.event_info[0]?.link
                  }
                  target="_blank"
                  underline="none"
                >
                  <Button 
                    variant="contained" 
                    fullWidth 
                    disabled={individualLoading && show.id === loadingId}
                  >
                    Buy Now <OpenInNewIcon sx={{ ml: 1 }} />
                  </Button>
                </Link>

                {(show.category_id === 1) && (
                  <Button 
                    variant="outlined" 
                    onClick={() => fetchTodayTix(show.id)}
                  >
                    Price Compare
                  </Button>
                )}

                {(compareId === show.id) && (
                  !compareLoading ? 
                    todaytixPrice && (
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Stubhub w/ estimated fees: ${Math.floor(show.event_info[0]?.price * 1.32)}
                        </Typography>
                        <Typography variant="body2">
                          TodayTix price: ${todaytixPrice}
                        </Typography>
                      </Stack>
                    )
                  : "Loading"
                )}
              </Stack>
            </CardContent>
          </Card>
        )
      ))}
    </Box>
  );
};

export default VerticalSlider;