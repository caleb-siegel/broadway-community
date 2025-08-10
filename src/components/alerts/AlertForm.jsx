import React, { useState, useEffect } from "react";
import { Typography, Box, Button, TextField, IconButton, ToggleButtonGroup, ToggleButton, InputAdornment, useStepContext, Tooltip, Autocomplete, FormControl, InputLabel, Select, MenuItem, Chip, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Email, Sms, NotificationsActive, Lock, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const AlertForm = ({ onClose, initialData = null, handleSubmit, trackingType, selectedItem, priceThreshold, handleTrackingTypeChange, setOptions, options, handleSearchChange, searchValue, handleSelectedItem, handlePriceThreshold, notificationMethod, onNotificationMethodChange }) => {
    const { user } = useOutletContext();

    const [priceType, setPriceType] = useState('percentage');
    const [priceNumber, setPriceNumber] = useState(initialData?.priceNumber || null);
    const [pricePercent, setPricePercent] = useState(initialData?.pricePercent || null);
    const [startDate, setStartDate] = useState(initialData?.startDate || "");
    const [endDate, setEndDate] = useState(initialData?.endDate || "");
    const [showTime, setShowTime] = useState(initialData?.showTime || "");
    const [showDateRange, setShowDateRange] = useState(false);
    const [showTimeOptions, setShowTimeOptions] = useState(false);
    const [showWeekdayOptions, setShowWeekdayOptions] = useState(false);
    const [selectedWeekdays, setSelectedWeekdays] = useState(initialData?.weekday || []);
    
    // Handle initialData changes (for editing existing alerts)
    useEffect(() => {
        if (initialData) {
            setPriceNumber(initialData.priceNumber || null);
            setPricePercent(initialData.pricePercent || null);
            setStartDate(initialData.startDate || "");
            setEndDate(initialData.endDate || "");
            setShowTime(initialData.showTime || "");
            
            // Handle weekday data conversion (could be array, string, or null)
            let weekdays = [];
            if (initialData.weekday) {
                if (Array.isArray(initialData.weekday)) {
                    weekdays = initialData.weekday;
                } else if (typeof initialData.weekday === 'string') {
                    try {
                        weekdays = JSON.parse(initialData.weekday);
                    } catch (e) {
                        weekdays = [];
                    }
                }
            }
            setSelectedWeekdays(weekdays);
            
            // Set the appropriate toggles based on data
            setShowDateRange(!!(initialData.startDate || initialData.endDate));
            setShowTimeOptions(!!initialData.showTime);
            setShowWeekdayOptions(!!(weekdays && weekdays.length > 0));
            
            // Set price type based on what's available
            if (initialData.pricePercent) {
                setPriceType('percentage');
            } else if (initialData.priceNumber) {
                setPriceType('specific');
            }
        }
    }, [initialData]);

    const weekdays = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' }
    ];

    const handleWeekdayChange = (weekdayValue) => {
        setSelectedWeekdays(prev => {
            if (prev.includes(weekdayValue)) {
                return prev.filter(day => day !== weekdayValue);
            } else {
                return [...prev, weekdayValue].sort();
            }
        });
    };

    const toggleWeekdayOptions = () => {
        setShowWeekdayOptions(!showWeekdayOptions);
        if (showWeekdayOptions) {
            setSelectedWeekdays([]);
        }
    };

    const handlePriceTypeChange = (event, newType) => {
        if (newType) {
            setPriceType(newType);
        }
    };

    const handleShowTimeChange = (event) => {
        setShowTime(event.target.value);
    };

    const toggleDateRange = () => {
        setShowDateRange(!showDateRange);
        if (showDateRange) {
            setStartDate("");
            setEndDate("");
        }
    };

    const toggleShowTime = () => {
        setShowTimeOptions(!showTimeOptions);
        if (showTimeOptions) {
            setShowTime("");
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        
        // Prepare the form data with all the new fields
        const formData = {
            notificationMethod,
            trackingType,
            selectedItem,
            priceType,
            priceNumber: priceType === "specific" ? Number(priceNumber) : null,
            pricePercent: priceType === "percentage" ? Number(pricePercent) : null,
            startDate: showDateRange ? startDate : null,
            endDate: showDateRange ? endDate : null,
            showTime: showTimeOptions ? showTime : null,
            weekday: showWeekdayOptions ? selectedWeekdays : null,
        };
        console.log('formdata: ', formData)
        // Call the parent's handleSubmit with the complete form data
        handleSubmit(formData);
    };

    // Common styles for form sections
    const sectionStyle = {
        mb: 3,
    };

    const headerStyle = {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'text.primary',
        mb: 1.5,
    };

    const toggleButtonGroupStyle = {
        '& .MuiToggleButton-root': {
            borderRadius: '20px',
            py: 1,
            px: 2,
            textTransform: 'none',
            fontSize: '0.9rem',
            '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'primary.dark',
                },
            },
        },
        '& .MuiToggleButtonGroup-grouped': {
            mx: 0.5,
            border: '1px solid',
            borderColor: 'divider',
            '&:not(:first-of-type)': {
                borderRadius: '20px',
            },
            '&:first-of-type': {
                borderRadius: '20px',
            },
        },
    };

    return (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ p: { xs: 2, sm: 3 }, "& > *": { mb: 3 } }}>
            {/* What to Track and Price Alert Type - Side by Side */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                {/* What to Track Section */}
                <Box sx={sectionStyle}>
                    <Typography sx={headerStyle}>What to Track</Typography>
                    <ToggleButtonGroup 
                        value={trackingType} 
                        exclusive 
                        onChange={(e, value) => value && handleTrackingTypeChange(value)} 
                        fullWidth 
                        sx={toggleButtonGroupStyle}
                    >
                        <ToggleButton value="event">Events</ToggleButton>
                        <ToggleButton value="category">Categories</ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{ mt: 2 }}>
                        <Autocomplete 
                            fullWidth 
                            options={options} 
                            inputValue={searchValue} 
                            onInputChange={(event, newValue) => handleSearchChange(event, newValue)} 
                            value={selectedItem} 
                            onChange={(event, newValue) => handleSelectedItem(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder={`Search for ${trackingType === "event" ? "an event" : "a category"}...`}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            fontSize: '0.9rem',
                                            '& fieldset': {
                                                borderWidth: 1,
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </Box>
                </Box>

                {/* Price Alert Type Section */}
                <Box sx={sectionStyle}>
                    <Typography sx={headerStyle}>Price Alert Type</Typography>
                    <ToggleButtonGroup 
                        value={priceType} 
                        exclusive 
                        onChange={handlePriceTypeChange} 
                        fullWidth 
                        sx={toggleButtonGroupStyle}
                    >
                        <ToggleButton value="specific">Specific Price</ToggleButton>
                        <ToggleButton value="percentage">Percentage Discount</ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{ mt: 2 }}>
                        {priceType === "specific" ? (
                            <TextField 
                                fullWidth 
                                type="number" 
                                placeholder="Enter maximum price" 
                                value={priceNumber} 
                                onChange={(e) => setPriceNumber(e.target.value)} 
                                InputProps={{ 
                                    startAdornment: <InputAdornment position="start">$</InputAdornment> 
                                }} 
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        fontSize: '0.9rem',
                                        '& fieldset': {
                                            borderWidth: 1,
                                        },
                                    },
                                }} 
                            />
                        ) : (
                            <TextField 
                                fullWidth 
                                type="number" 
                                placeholder="Enter percentage discount to the average" 
                                value={pricePercent} 
                                onChange={(e) => setPricePercent(e.target.value)} 
                                InputProps={{ 
                                    endAdornment: <InputAdornment position="end">%</InputAdornment> 
                                }} 
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        fontSize: '0.9rem',
                                        '& fieldset': {
                                            borderWidth: 1,
                                        },
                                    },
                                }} 
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Optional Preferences */}
            <Box sx={sectionStyle}>
                <Typography sx={headerStyle}>Optional Preferences</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    <Chip
                        label="Date Range"
                        onClick={toggleDateRange}
                        variant={showDateRange ? "filled" : "outlined"}
                        color={showDateRange ? "primary" : "default"}
                        icon={showDateRange ? <ExpandLess /> : <ExpandMore />}
                        sx={{ 
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            height: '32px',
                            '&:hover': {
                                backgroundColor: showDateRange ? "primary.main" : "action.hover"
                            }
                        }}
                    />
                    
                    <Chip
                        label="Show Time"
                        onClick={toggleShowTime}
                        variant={showTimeOptions ? "filled" : "outlined"}
                        color={showTimeOptions ? "primary" : "default"}
                        icon={showTimeOptions ? <ExpandLess /> : <ExpandMore />}
                        sx={{ 
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            height: '32px',
                            '&:hover': {
                                backgroundColor: showTimeOptions ? "primary.main" : "action.hover"
                            }
                        }}
                    />

                    <Chip
                        label="Weekdays"
                        onClick={toggleWeekdayOptions}
                        variant={showWeekdayOptions ? "filled" : "outlined"}
                        color={showWeekdayOptions ? "primary" : "default"}
                        icon={showWeekdayOptions ? <ExpandLess /> : <ExpandMore />}
                        sx={{ 
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            height: '32px',
                            '&:hover': {
                                backgroundColor: showWeekdayOptions ? "primary.main" : "action.hover"
                            }
                        }}
                    />
                </Box>

                {/* Optional Preferences - Always half width */}
                {(showDateRange || showTimeOptions || showWeekdayOptions) && (
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: 2,
                        maxWidth: '50%'
                    }}>
                        {showDateRange && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Date Range</Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                fontSize: '0.9rem',
                                                '& fieldset': {
                                                    borderWidth: 1,
                                                },
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="End Date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                fontSize: '0.9rem',
                                                '& fieldset': {
                                                    borderWidth: 1,
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}

                        {showTimeOptions && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Show Time</Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={showTime}
                                        displayEmpty
                                        onChange={handleShowTimeChange}
                                        sx={{ 
                                            borderRadius: '12px',
                                            fontSize: '0.9rem',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: 1,
                                            },
                                        }}
                                    >
                                        <MenuItem value="matinee" sx={{ fontSize: '0.9rem' }}>Matinee</MenuItem>
                                        <MenuItem value="evening" sx={{ fontSize: '0.9rem' }}>Evening</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        {showWeekdayOptions && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Weekdays</Typography>
                                <FormGroup>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                                        {weekdays.map((day) => (
                                            <FormControlLabel
                                                key={day.value}
                                                control={
                                                    <Checkbox
                                                        checked={selectedWeekdays.includes(day.value)}
                                                        onChange={() => handleWeekdayChange(day.value)}
                                                        size="small"
                                                    />
                                                }
                                                label={day.label}
                                                sx={{ fontSize: '0.8rem' }}
                                            />
                                        ))}
                                    </Box>
                                </FormGroup>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
    
            {/* Save Button */}
            <Button 
                variant="contained" 
                fullWidth 
                onClick={onClose} 
                type="submit" 
                sx={{ 
                    bgcolor: "primary.main",
                    color: "white",
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: "primary.dark",
                        boxShadow: 'none',
                    },
                }} 
            >
                Save Alert
            </Button>
            {notificationMethod === "sms" && (
                <Typography variant="body2" sx={{ mt: 1.5, textAlign: 'center', color: 'text.secondary' }}>
                    *SMS notifications require a premium subscription
                </Typography>
            )}
        </Box>
    );
};

export default AlertForm