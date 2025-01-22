import React, { useState, useEffect } from "react";
import { Typography, Box, Button, TextField, IconButton, ToggleButtonGroup, ToggleButton, InputAdornment, useStepContext, Tooltip, Autocomplete } from "@mui/material";
import { Email, Sms, NotificationsActive } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const AlertForm = ({ onClose, initialData = null, handleSubmit, trackingType, selectedItem, emailBool, smsBool, pushBool, priceThreshold, handleTrackingTypeChange, setOptions, options, handleSearchChange, searchValue, handleSelectedItem, handlePriceThreshold }) => {
    const { user } = useOutletContext();

    const [notificationMethod, setNotificationMethod] = useState(initialData?.notificationMethod || "email");    

    const handleNotificationChange = (event, newMethod) => {
        if (newMethod) {
            setNotificationMethod(newMethod);
        }
    };
    

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, "& > *": { mb: 4 } }}>
            {/* Notification Method */}
            <Box>
                <Typography variant="h6" gutterBottom>Notification Method</Typography>
                <ToggleButtonGroup value={notificationMethod} exclusive onChange={handleNotificationChange} fullWidth >
                    {/* Email Button */}
                    <ToggleButton value="email" sx={{ py: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", }} >
                        <Email sx={{ mr: 1 }} /> Email
                    </ToggleButton>

                    {/* SMS Button (Greyed Out and Disabled) */}
                    <Tooltip title="This is not yet available" arrow>
                        <span style={{ flex: 1 }}>
                            <ToggleButton
                                value="sms"
                                disabled
                                sx={{
                                    py: 2,
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.disabled", // Grey text
                                    bgcolor: "action.disabledBackground", // Grey background
                                    "&.Mui-disabled": {
                                        cursor: "not-allowed", // Change cursor to indicate disabled state
                                    },
                                }}
                            >
                                <Sms sx={{ mr: 1 }} /> SMS
                            </ToggleButton>
                        </span>
                    </Tooltip>

                    {/* Push Button (Greyed Out and Disabled) */}
                    <Tooltip title="This is not yet available" arrow>
                        <span style={{ flex: 1 }}>
                            <ToggleButton
                                value="push"
                                disabled
                                sx={{
                                    py: 2,
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "text.disabled", // Grey text
                                    bgcolor: "action.disabledBackground", // Grey background
                                    "&.Mui-disabled": {
                                        cursor: "not-allowed", // Change cursor to indicate disabled state
                                    },
                                }}
                            >
                                <NotificationsActive sx={{ mr: 1 }} /> Push
                            </ToggleButton>
                        </span>
                    </Tooltip>
                </ToggleButtonGroup>
            </Box>
    
            {/* Tracking Type */}
            <Box>
                <Typography variant="h6" gutterBottom> What to Track </Typography>
                <ToggleButtonGroup value={trackingType} exclusive onChange={(e, value) => value && handleTrackingTypeChange(value)} fullWidth sx={{ mb: 2 }} >
                    <ToggleButton value="event" sx={{ py: 2 }}> Events </ToggleButton>
                    <ToggleButton value="category" sx={{ py: 2 }}> Categories </ToggleButton>
                </ToggleButtonGroup>

                <Autocomplete fullWidth options={options} inputValue={searchValue} onInputChange={(event, newValue) => handleSearchChange(event, newValue)} value={selectedItem} onChange={(event, newValue) => handleSelectedItem(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={`Search for ${
                                trackingType === "event" ? "an event" : "a category"
                            }...`}
                            InputProps={{
                                ...params.InputProps,
                            }}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4, fontSize: "1.1rem", "& fieldset": { borderWidth: 2, }, }, }}
                        />
                    )}
                />
            </Box>
    
            {/* Price Threshold */}
            <Box>
                <Typography variant="h6" gutterBottom> Price Threshold </Typography>
                <TextField fullWidth type="number" placeholder="Enter maximum price" value={priceThreshold} onChange={(e) => handlePriceThreshold(e)} InputProps={{ startAdornment: ( <InputAdornment position="start">$</InputAdornment> ), }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4, fontSize: "1.1rem", "& fieldset": { borderWidth: 2, }, }, }} />
            </Box>
    
            {/* Save Button */}
            <Button variant="contained" fullWidth onClick={onClose} type="submit" sx={{ bgcolor: "black", color: "white", py: 2, borderRadius: 4, fontSize: "1.1rem", "&:hover": { bgcolor: "rgb(45, 45, 45)", }, }} >
                Save Alert
            </Button>
        </Box>
        );
    };

export default AlertForm