import React, { useState, useEffect } from 'react';
import { 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Box, 
    CircularProgress,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Tooltip
} from '@mui/material';
import './addEvent.css';
import { useOutletContext } from "react-router-dom";

function AddEvent() {
    const [stubhubLink, setStubhubLink] = useState('');
    const [eventInfo, setEventInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStubhubCategories, setSelectedStubhubCategories] = useState([]);
    const [selectedVenues, setSelectedVenues] = useState([]);
    const [success, setSuccess] = useState(false);
    const [venueInfo, setVenueInfo] = useState(null);
    const [existingEvents, setExistingEvents] = useState({});  // Track which categories are already being tracked
    

    
    const { backendUrl } = useOutletContext();

    useEffect(() => {
        fetch(`${backendUrl}/api/category_names`)
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(err => setError('Failed to load categories'));
    }, []);

    const validateStubhubLink = (link) => {
        // Check if link starts with stubhub.com
        const baseUrlRegex = /stubhub\.com/;
        if (!baseUrlRegex.test(link)) {
            setError('You must enter a link from stubhub');
            return false;
        }

        // Check if link contains /event/ followed by numbers
        const eventIdRegex = /\/event\/\d+/;
        if (!eventIdRegex.test(link)) {
            setError('Invalid Link. Make sure to paste a link from a specific Stubhub event.');
            return false;
        }

        return true;
    };

    const handleLinkSubmit = async () => {
        if (!stubhubLink) return;

        // Clear any previous errors and states
        setError(null);
        setExistingEvents({});

        // Validate the link format
        if (!validateStubhubLink(stubhubLink)) {
            return;
        }

        setLoading(true);
        
        try {
            // First fetch event info
            const eventResponse = await fetch(
                `${backendUrl}/api/add_tracked_event?link=${encodeURIComponent(stubhubLink)}`
            );
            
            if (!eventResponse.ok) {
                throw new Error('EVENT_NOT_FOUND');
            }
            
            const eventData = await eventResponse.json();
            
            if (!eventData || !eventData.name) {
                throw new Error('EVENT_NOT_FOUND');
            }

            // Then check which categories are already being tracked
            const existingResponse = await fetch(
                `${backendUrl}/api/check_existing_events?stubhub_categories=${eventData.categories.map(c => c.id).join(',')}`
            );
            
            if (existingResponse.ok) {
                const existingData = await existingResponse.json();
                setExistingEvents(existingData);
            }

            setEventInfo(eventData);
            setError(null);
        } catch (err) {
            if (err.message === 'EVENT_NOT_FOUND') {
                setError('This event does not exist on Stubhub. Please check the link and try again.');
            } else {
                setError('Failed to fetch event information. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStubhubCategoryToggle = (categoryId) => {
        // Check if category is already tracked with both venue options
        const existing = existingEvents[categoryId] || {};
        if (existing.specific && existing.any) {
            return; // Can't select if both options are already tracked
        }

        setSelectedStubhubCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handleVenueSelect = (include) => {
        // Only allow selecting venue options that aren't already tracked for the selected categories
        const hasConflict = selectedStubhubCategories.some(categoryId => {
            const existing = existingEvents[categoryId] || {};
            return existing[include];
        });

        if (hasConflict) {
            return;
        }

        setSelectedVenues(prev => {
            if (prev.includes(include)) {
                return prev.filter(type => type !== include);
            } else {
                return [...prev, include];
            }
        });

        // Only set venue info if specific venue is selected
        if (include === 'specific' && !venueInfo && eventInfo.venue) {
            setVenueInfo({
                name: eventInfo.venue.name,
                stubhub_venue_id: String(eventInfo.venue.id),
                latitude: String(eventInfo.venue.latitude),
                longitude: String(eventInfo.venue.longitude)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`Selected Stubhub Categories: ${selectedStubhubCategories}`);
        if (!selectedCategory || selectedStubhubCategories.length === 0 || selectedVenues.length === 0) {
            setError('Please select a category, at least one Stubhub category, and at least one venue option');
            return;
        }

        setLoading(true);

        try {
            let venue_id = null;
            
            // First, create venue if needed
            if (selectedVenues.includes('specific') && venueInfo) {
                const venueResponse = await fetch(`${backendUrl}/api/venues`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(venueInfo)
                });

                if (venueResponse.ok) {
                    const venueData = await venueResponse.json();
                    venue_id = venueData.id;
                } else {
                    throw new Error('Failed to create venue');
                }
            }

            // Create events for each combination of selected Stubhub category and venue type
            const eventPromises = [];

            for (const stubhubCategoryId of selectedStubhubCategories) {
                const selectedStubhubCategoryName = eventInfo.categories.find(
                    cat => cat.id === stubhubCategoryId
                )?.name;

                // Create events for each selected venue type
                if (selectedVenues.includes('specific')) {
                    const specificVenueData = {
                        name: selectedStubhubCategoryName || '',
                        category_id: selectedCategory,
                        venue_id: venue_id,
                        stubhub_categories: stubhubCategoryId
                    };

                    eventPromises.push(
                        fetch(`${backendUrl}/api/events`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(specificVenueData)
                        })
                    );
                }

                if (selectedVenues.includes('any')) {
                    const anyVenueData = {
                        name: selectedStubhubCategoryName || '',
                        category_id: selectedCategory,
                        venue_id: null,
                        stubhub_categories: stubhubCategoryId
                    };

                    eventPromises.push(
                        fetch(`${backendUrl}/api/events`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(anyVenueData)
                        })
                    );
                }
            }

            // Wait for all events to be created
            const responses = await Promise.all(eventPromises);
            
            // Check if any requests failed
            for (const response of responses) {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save event');
                }
            }

            setSuccess(true);
            // Reset form
            setStubhubLink('');
            setEventInfo(null);
            setSelectedCategory('');
            setSelectedStubhubCategories([]);
            setSelectedVenues([]);
            setVenueInfo(null);

        } catch (err) {
            setError(err.message || 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="add-event-page">
            <Box className="add-event-header">
                <Typography variant="h1" align="center" gutterBottom>
                    Add New Event
                </Typography>
                <Typography 
                    variant="body1" 
                    align="center" 
                    color="textSecondary" 
                    sx={{ 
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.6,
                        textAlign: 'center',
                        display: 'block'
                    }}
                >
                    Want to add an event to be tracked? Simply paste a Stubhub event link below (make sure it's a link of a specific night's event), 
                    and we'll get it set up for you.
                </Typography>
            </Box>

            <Paper elevation={3} className="add-event-form-container">
                {!eventInfo && (
                    <Box className="input-group">
                        <TextField
                            fullWidth
                            label="Stubhub Event Link"
                            variant="outlined"
                            value={stubhubLink}
                            onChange={(e) => setStubhubLink(e.target.value)}
                            placeholder="https://www.stubhub.com/event/..."
                            required
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
                            
                            <Button 
                                onClick={handleLinkSubmit}
                                variant="contained"
                                disabled={loading || !stubhubLink}
                                className="fetch-button"
                                sx={{ backgroundColor: '#156064 !important' }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Find Event'}
                            </Button>
                        </Box>
                    </Box>
                )}

                {eventInfo && (
                    <form onSubmit={handleSubmit}>
                        <Box className="form-section">
                            {eventInfo && (
                                <>
                                    <Box className="input-group">
                                        <Typography variant="body2" className="input-description">
                                            Choose the category for this event
                                        </Typography>
                                        <FormControl 
                                            variant="outlined" 
                                            className="category-select"
                                            sx={{ 
                                                width: '200px',
                                                marginTop: '8px',
                                                '& .MuiOutlinedInput-root': {
                                                    height: '40px'
                                                },
                                                '& .MuiInputLabel-root': {
                                                    transform: 'translate(14px, 8px) scale(1)'
                                                },
                                                '& .MuiInputLabel-shrink': {
                                                    transform: 'translate(14px, -9px) scale(0.75)'
                                                }
                                            }}
                                        >
                                            <InputLabel id="category-select-label">Category</InputLabel>
                                            <Select
                                                labelId="category-select-label"
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                label="Category"
                                                required
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 300,
                                                            borderRadius: '8px',
                                                        },
                                                    },
                                                }}
                                            >
                                                {categories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>

                                    <Box className="input-group">
                                        <Typography 
                                            variant="body2" 
                                            className="input-description"
                                            sx={{ marginBottom: '8px' }}
                                        >
                                            Choose which event or events to track
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {eventInfo.categories.map((category) => {
                                                const existing = existingEvents[category.id] || {};
                                                const isFullyTracked = existing.specific && existing.any;
                                                
                                                const card = (
                                                    <Card 
                                                        className={`category-card ${selectedStubhubCategories.includes(category.id) ? 'selected-category' : ''} ${isFullyTracked ? 'disabled-card' : ''}`}
                                                        onClick={() => !isFullyTracked && handleStubhubCategoryToggle(category.id)}
                                                        sx={{ 
                                                            opacity: isFullyTracked ? 0.5 : 1,
                                                            cursor: isFullyTracked ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography>{category.name}</Typography>
                                                        </CardContent>
                                                    </Card>
                                                );

                                                return isFullyTracked ? (
                                                    <Tooltip 
                                                        key={category.id}
                                                        title="This event is already being tracked with both venue options"
                                                        arrow
                                                    >
                                                        <span>{card}</span>
                                                    </Tooltip>
                                                ) : (
                                                    <React.Fragment key={category.id}>
                                                        {card}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </Box>
                                    </Box>

                                    <Box className="input-group venue-options">
                                        <Typography variant="body2" className="input-description">
                                            Choose whether to track this event with this specific venue or any venue or choose both
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {['specific', 'any'].map(venueType => {
                                                // Check if this venue type is already tracked for any selected category
                                                const isDisabled = selectedStubhubCategories.some(categoryId => {
                                                    const existing = existingEvents[categoryId] || {};
                                                    return existing[venueType];
                                                });

                                                const card = (
                                                    <Card 
                                                        className={`venue-card ${selectedVenues.includes(venueType) ? 'selected-category' : ''} ${isDisabled ? 'disabled-card' : ''}`}
                                                        onClick={() => !isDisabled && handleVenueSelect(venueType)}
                                                        sx={{ 
                                                            opacity: isDisabled ? 0.5 : 1,
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography>
                                                                {venueType === 'specific' ? eventInfo.venue.name : 'Any Venue'}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                );
                                                
                                                return isDisabled ? (
                                                    <Tooltip 
                                                        key={venueType}
                                                        title="This venue option is already being tracked"
                                                        arrow
                                                    >
                                                        <span>{card}</span>
                                                    </Tooltip>
                                                ) : (
                                                    <React.Fragment key={venueType}>
                                                        {card}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </Box>
                                    </Box>

                                    <Box className="submit-button-container">
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={loading || !selectedCategory || selectedStubhubCategories.length === 0 || selectedVenues.length === 0}
                                            className="submit-button"
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Save Event'}
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </form>
                )}

                {error && (
                    <Alert severity="error" className="alert-message">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" className="alert-message">
                        Event added successfully!
                    </Alert>
                )}
            </Paper>
        </Box>
    );
}

export default AddEvent; 