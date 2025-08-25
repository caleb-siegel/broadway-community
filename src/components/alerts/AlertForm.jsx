import React, { useState, useEffect } from "react";
import { Typography, Box, Button, TextField, IconButton, ToggleButtonGroup, ToggleButton, InputAdornment, useStepContext, Tooltip, Autocomplete, FormControl, InputLabel, Select, MenuItem, Chip, Checkbox, FormControlLabel, FormGroup, Alert } from "@mui/material";
import { Email, Sms, NotificationsActive, Lock, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const AlertForm = ({ onClose, initialData = null, handleSubmit, trackingType, selectedItem, priceThreshold, handleTrackingTypeChange, setOptions, options, handleSearchChange, searchValue, handleSelectedItem, handlePriceThreshold, notificationMethod, onNotificationMethodChange, averagePrice }) => {
    const { user } = useOutletContext();

    const [priceType, setPriceType] = useState('percentage');
    const [priceNumber, setPriceNumber] = useState(initialData?.priceNumber || "");
    const [pricePercent, setPricePercent] = useState(initialData?.pricePercent || "");
    const [startDate, setStartDate] = useState(initialData?.startDate || "");
    const [endDate, setEndDate] = useState(initialData?.endDate || "");
    const [showTime, setShowTime] = useState(initialData?.showTime || "");
    const [timeToShow, setTimeToShow] = useState(initialData?.timeToShow || "");
    const [showDateRange, setShowDateRange] = useState(false);
    const [showTimeOptions, setShowTimeOptions] = useState(false);
    const [showTimeToShowOptions, setShowTimeToShowOptions] = useState(false);
    const [showWeekdayOptions, setShowWeekdayOptions] = useState(false);
    const [selectedWeekdays, setSelectedWeekdays] = useState(initialData?.weekday || []);
    
    // Validation states
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Handle initialData changes (for editing existing alerts)
    useEffect(() => {
        if (initialData) {
            setPriceNumber(initialData.priceNumber || "");
            setPricePercent(initialData.pricePercent || "");
            setStartDate(initialData.startDate || "");
            setEndDate(initialData.endDate || "");
            setShowTime(initialData.showTime || "");
            setTimeToShow(initialData.timeToShow || "");
            
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
            setTimeToShowOptions(!!initialData.timeToShow);
            
            // Set price type based on what's available
            if (initialData.pricePercent) {
                setPriceType('percentage');
            } else if (initialData.priceNumber) {
                setPriceType('specific');
            }
        }
    }, [initialData]);

    // Clear errors when user makes changes
    useEffect(() => {
        if (errors.selectedItem && selectedItem) {
            setErrors(prev => ({ ...prev, selectedItem: null }));
        }
    }, [selectedItem, errors.selectedItem]);

    useEffect(() => {
        if (errors.price && (priceNumber || pricePercent)) {
            setErrors(prev => ({ ...prev, price: null }));
        }
    }, [priceNumber, pricePercent, errors.price]);

    useEffect(() => {
        if (errors.dateRange && startDate && endDate) {
            if (new Date(startDate) <= new Date(endDate)) {
                setErrors(prev => ({ ...prev, dateRange: null }));
            }
        }
    }, [startDate, endDate, errors.dateRange]);

    const weekdays = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' }
    ];

    const validateForm = () => {
        const newErrors = {};

        // Validate selected item
        if (!selectedItem || selectedItem.trim() === '') {
            newErrors.selectedItem = 'Please select an item to track';
        }

        // Validate price
        if (priceType === 'specific') {
            if (!priceNumber || priceNumber.trim() === '' || isNaN(priceNumber) || Number(priceNumber) <= 0) {
                newErrors.price = 'Please enter a valid price';
            }
        } else if (priceType === 'percentage') {
            if (!pricePercent || pricePercent.trim() === '' || isNaN(pricePercent) || Number(pricePercent) <= 0) {
                newErrors.price = 'Please enter a valid percentage';
            }
        }

        // Validate date range if both dates are provided
        if (showDateRange && startDate && endDate) {
            if (new Date(startDate) > new Date(endDate)) {
                newErrors.dateRange = 'End date cannot be before start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
            // Clear price values when switching type to avoid confusion
            if (newType === 'specific') {
                setPricePercent("");
            } else {
                setPriceNumber("");
            }
            // Clear price error
            if (errors.price) {
                setErrors(prev => ({ ...prev, price: null }));
            }
        }
    };

    const handleShowTimeChange = (event) => {
        setShowTime(event.target.value);
    };

    const handleTimeToShowChange = (event) => {
        setTimeToShow(event.target.value);
    };

    const toggleDateRange = () => {
        setShowDateRange(!showDateRange);
        if (showDateRange) {
            setStartDate("");
            setEndDate("");
            // Clear date range error
            if (errors.dateRange) {
                setErrors(prev => ({ ...prev, dateRange: null }));
            }
        }
    };

    const toggleShowTime = () => {
        setShowTimeOptions(!showTimeOptions);
        if (showTimeOptions) {
            setShowTime("");
        }
    };

    const toggleTimeToShow = () => {
        setShowTimeToShowOptions(!showTimeToShowOptions);
        if (showTimeToShowOptions) {
            setTimeToShow("");
        }
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        
        setIsSubmitting(true);
        
        // Validate form
        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }
        
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
            timeToShow: showTimeToShowOptions ? timeToShow : null,
        };
                
        // Call the parent's handleSubmit with the complete form data
        handleSubmit(formData);
        setIsSubmitting(false);
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
            fontSize: '0.8rem',
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
            {/* Display validation errors */}
            {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Please fix the following errors:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>
                                <Typography variant="body2">{error}</Typography>
                            </li>
                        ))}
                    </ul>
                </Alert>
            )}

            {/* What to Track and Price Alert Type - Responsive Layout */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3 
            }}>
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
                                    error={!!errors.selectedItem}
                                    helperText={errors.selectedItem}
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
                    {trackingType === "event" && selectedItem && averagePrice !== null && (
                        <Typography 
                            variant="body2" 
                            sx={{ mt: 1, color: "text.secondary", fontSize: "0.85rem" }}
                        >
                            Generally can get tickets to {selectedItem} for as low as ${Math.round(averagePrice)}
                        </Typography>
                    )}
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
                                error={!!errors.price}
                                helperText={errors.price}
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
                                error={!!errors.price}
                                helperText={errors.price}
                                InputProps={{ 
                                    endAdornment: <InputAdornment position="end">%</InputAdornment> 
                                }} 
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
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

                    <Chip
                        label="Time Before Show"
                        onClick={toggleTimeToShow}
                        variant={showTimeToShowOptions ? "filled" : "outlined"}
                        color={showTimeToShowOptions ? "primary" : "default"}
                        icon={showTimeToShowOptions ? <ExpandLess /> : <ExpandMore />}
                        sx={{ 
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            height: '32px',
                            '&:hover': {
                                backgroundColor: showTimeToShowOptions ? "primary.main" : "action.hover"
                            }
                        }}
                    />
                </Box>

                {/* Display date range error */}
                {errors.dateRange && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.dateRange}
                    </Alert>
                )}

                {/* Optional Preferences - Responsive Layout */}
                {(showDateRange || showTimeOptions || showWeekdayOptions || showTimeToShowOptions) && (
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                        gap: 2,
                        maxWidth: { xs: '100%', md: '50%' }
                    }}>
                        {showDateRange && (
                            <Box sx={{ gridColumn: { xs: '1', md: 'auto' } }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Date Range</Typography>
                                <Box sx={{ 
                                    display: "flex", 
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 1 
                                }}>
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
                            <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Weekdays</Typography>
                                <FormGroup>
                                    <Box sx={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' },
                                        gap: 1 
                                    }}>
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
                                                sx={{ 
                                                    fontSize: '0.8rem',
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </FormGroup>
                            </Box>
                        )}

                        {showTimeToShowOptions && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem' }}>Minimum # of hours before the show starts</Typography>
                                <FormControl fullWidth>
                                    <TextField
                                        value={timeToShow}
                                        type='number'
                                        onChange={handleTimeToShowChange}
                                        sx={{
                                            borderRadius: '12px',
                                            fontSize: '0.9rem',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: 1,
                                            },
                                        }}
                                    />
                                </FormControl>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
    
            {/* Save Button */}
            <Button 
                variant="contained" 
                fullWidth 
                type="submit" 
                disabled={isSubmitting}
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
                    '&:disabled': {
                        bgcolor: 'grey.400',
                        color: 'white'
                    }
                }} 
            >
                {isSubmitting ? 'Saving...' : 'Save Alert'}
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