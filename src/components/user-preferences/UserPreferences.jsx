import React, { useState, useEffect} from 'react'
import { useOutletContext } from "react-router-dom";
import { Container, Typography, Box, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, Paper, MenuItem, Grid, ToggleButtonGroup, ToggleButton, InputAdornment, FormControl, Select } from "@mui/material";

const UserPreferences = () => {
    const { backendUrl } = useOutletContext();
    
    const [userPreferences, setUserPreferences] = useState([]);
    useEffect(() => {
        fetch(
        `${backendUrl}/api/event_preferences`
        )
        .then((response) => response.json())
        .then((data) => {
            setUserPreferences(data);
        });
    }, []);

    const [userCategoryPreferences, setUserCategoryPreferences] = useState([]);
    useEffect(() => {
        fetch(
        `${backendUrl}/api/category_preferences`
        )
        .then((response) => response.json())
        .then((data) => {
            setUserCategoryPreferences(data);
        });
    }, []);
    
    return (
        <div className='userPreferences__container'>
            <div>userpreferences</div>
            <div>userpreferences</div>
            <div>userpreferences</div>
            <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row'} }}>
            <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
              Events
            </Typography>
              {userPreferences?.map((pref) => (
                <Paper
                  key={pref.id}
                  elevation={0}
                  sx={{
                    p: 1,
                    border: "2px solid",
                    borderColor: "grey.200",
                    borderRadius: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {`${pref.user.first_name} ${pref.user.last_name} - ${pref.event.name}`}
                      </Typography>
                      <Typography color="text.secondary">
                        Max Price:{" "}
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            ${pref.price}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
              Categories
            </Typography>
              {userCategoryPreferences?.map((pref) => (
                <Paper
                  key={pref.id}
                  elevation={0}
                  sx={{
                    p: 1,
                    border: "2px solid",
                    borderColor: "grey.200",
                    borderRadius: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {`${pref.user.first_name} ${pref.user.last_name} - ${pref.category.name}`}
                      </Typography>
                      <Typography color="text.secondary">
                        Max Price:{" "}
                        <Box component="span" sx={{ fontWeight: 500 }}>
                            ${pref.price}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Grid>
            
            </Grid>
        </div>
    )
}

export default UserPreferences