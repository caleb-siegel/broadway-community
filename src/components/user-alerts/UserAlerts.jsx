import React, { useState, useEffect} from 'react'
import { useOutletContext } from "react-router-dom";
import { Container, Typography, Box, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, Paper, MenuItem, Grid, ToggleButtonGroup, ToggleButton, InputAdornment, FormControl, Select } from "@mui/material";

const UserAlerts = () => {
    const { backendUrl } = useOutletContext();
    const { user } = useOutletContext();

    const [userAlerts, setUserAlerts] = useState([]);
    useEffect(() => {
        fetch(
        `${backendUrl}/api/event_alerts`
        )
        .then((response) => response.json())
        .then((data) => {
            setUserAlerts(data);
        });
    }, []);

    const [userCategoryAlerts, setUserCategoryAlerts] = useState([]);
    useEffect(() => {
        fetch(
        `${backendUrl}/api/category_alerts`
        )
        .then((response) => response.json())
        .then((data) => {
            setUserCategoryAlerts(data);
        });
    }, []);
    
    return (
        <div className='userAlerts__container'>
            <div>useralerts</div>
            <div>useralerts</div>
            <div>useralerts</div>
            {user.id == 8 ?
                <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row'} }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
                            Events
                        </Typography>
                        {userAlerts?.map((alert) => (
                            <Paper
                                key={alert.id}
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
                                        {`${alert.user.first_name} ${alert.user.last_name} - ${alert.event.name}`}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Max Price:{" "}
                                        <Box component="span" sx={{ fontWeight: 500 }}>
                                            ${alert.price}
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
                        {userCategoryAlerts?.map((alert) => (
                            <Paper
                            key={alert.id}
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
                                    {`${alert.user.first_name} ${alert.user.last_name} - ${alert.category.name}`}
                                </Typography>
                                <Typography color="text.secondary">
                                    Max Price:{" "}
                                    <Box component="span" sx={{ fontWeight: 500 }}>
                                        ${alert.price}
                                    </Box>
                                </Typography>
                                </Box>
                            </Box>
                            </Paper>
                        ))}
                    </Grid>
                </Grid>
            :
                <div>You don't have access</div>
            }
        </div>
    )
}

export default UserAlerts