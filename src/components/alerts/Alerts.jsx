import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, Paper, MenuItem, Grid, ToggleButtonGroup, ToggleButton, InputAdornment, FormControl, Select, Tooltip, CircularProgress } from "@mui/material";
import { Email, Sms, NotificationsActive, Refresh, Add, Edit, Delete, Close, Check, Lock } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import AlertForm from "./AlertForm";
import "./alerts.css";

const AlertsPage = () => {

  const { user } = useOutletContext();
  const { backendUrl } = useOutletContext();

  useEffect(() => {
    if (user) {
      setEventAlerts(user.event_alerts || []);
      setCategoryAlerts(user.category_alerts || []);
    }
  }, [user]);

  const [eventAlerts, setEventAlerts] = useState(user?.event_alerts || []);
  const [categoryAlerts, setCategoryAlerts] = useState(user?.category_alerts || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [showType, setShowType] = useState("Broadway");
  const [trackingType, setTrackingType] = useState("event");
  const [selectedItem, setSelectedItem] = useState("");
  const [notificationMethod, setNotificationMethod] = useState("email");
  const [priceThreshold, setPriceThreshold] = useState(0);
  const [options, setOptions] = useState([]);
  const [updatedId, setUpdatedId] = useState({})
  const [categoryObject, setCategoryObject] = useState({})
  
  // New editing states
  const [editingPrice, setEditingPrice] = useState("");
  const [editingPriceType, setEditingPriceType] = useState("specific"); // "specific" or "percentage"
  const [editingStartDate, setEditingStartDate] = useState("");
  const [editingEndDate, setEditingEndDate] = useState("");
  const [editingShowTime, setEditingShowTime] = useState("");
  const [editingWeekdays, setEditingWeekdays] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(new Set()); // Track which alerts are loading

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    
    // Determine price type and set appropriate value
    if (alert.price_percent) {
      setEditingPriceType("percentage");
      setEditingPrice(alert.price_percent.toString());
    } else if (alert.price_number) {
      setEditingPriceType("specific");
      setEditingPrice(alert.price_number.toString());
    } else {
      setEditingPriceType("specific");
      setEditingPrice(alert.price ? alert.price.toString() : "");
    }
    
    setEditingStartDate(alert.start_date || "");
    setEditingEndDate(alert.end_date || "");
    setEditingShowTime(alert.show_time || "");
    
    // Handle weekday data conversion (could be array, string, or null)
    let weekdays = [];
    if (alert.weekday) {
      if (Array.isArray(alert.weekday)) {
        weekdays = alert.weekday;
      } else if (typeof alert.weekday === 'string') {
        try {
          weekdays = JSON.parse(alert.weekday);
        } catch (e) {
          weekdays = [];
        }
      }
    }
    setEditingWeekdays(weekdays);
  };

  const handlePatch = (id, type) => {
    // Add alert to loading set
    setLoadingAlerts(prev => new Set(prev).add(id));
    
    const updateData = {
      price_number: editingPriceType === "specific" && editingPrice && !isNaN(editingPrice) ? parseFloat(editingPrice) : null,
      price_percent: editingPriceType === "percentage" && editingPrice && !isNaN(editingPrice) ? parseFloat(editingPrice) : null,
      start_date: editingStartDate || null,
      end_date: editingEndDate || null,
      show_time: editingShowTime || null,
      weekday: editingWeekdays.length > 0 ? editingWeekdays : null,
    };

    fetch(`${backendUrl}/api/${type}_alerts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updateData),
    })
    .then((response) => response.json())
    .then((data) => {
      // Update the local state
      if (type === "event") {
        setEventAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === id 
              ? { ...alert, ...updateData }
              : alert
          )
        );
      } else {
        setCategoryAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === id 
              ? { ...alert, ...updateData }
              : alert
          )
        );
      }
      
      // Reset editing state
      setEditingAlert(null);
      setEditingPrice("");
      setEditingPriceType("specific");
      setEditingStartDate("");
      setEditingEndDate("");
      setEditingShowTime("");
      
      // Remove from loading set
      setLoadingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    })
    .catch((error) => {
      console.error("Error updating alert:", error);
      
      // Remove from loading set on error
      setLoadingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    });
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "email":
        return <Email />;
      case "sms":
        return <Sms />;
      case "push":
        return <NotificationsActive />;
      default:
        return <Email />;
    }
  };

  const handleSubmit = (formData) => {
    console.log(selectedItem)
    console.log(priceNumber, pricePercent)
    if (!selectedItem || (!priceNumber && !pricePercent)) {
      alert("Please fill in all required fields.");
      return;
    }
    // Extract data from the form
    const {
      notificationMethod,
      trackingType,
      selectedItem,
      priceType,
      priceNumber,
      pricePercent,
      startDate,
      endDate,
      showTime,
      weekday
    } = formData;

    // Prepare the alert data for the new database structure
    const alertData = {
      user_id: user.id,
      notification_method: notificationMethod,
      price_number: priceType === "specific" ? priceNumber : null,
      price_percent: priceType === "percentage" ? pricePercent : null,
      start_date: startDate || null,
      end_date: endDate || null,
      show_time: showTime || null,
      weekday: weekday || null,
    };

    // Add the appropriate foreign key based on tracking type
    if (trackingType === "event") {
      // For events, we need to find the event ID by name
      fetch(`${backendUrl}/api/events/name/${encodeURIComponent(selectedItem)}`)
        .then(response => response.json())
        .then(events => {
          if (events) {
            alertData.event_id = events.id;
            createAlert(alertData, "event");
          }
        });
    } else {
      // For categories, we need to find the category ID by name
      const matchingCategory = categoryObject.find(
        (category) => category.name === selectedItem
      );
      
      if (matchingCategory) {
        alertData.category_id = matchingCategory.id;
        createAlert(alertData, "category");
      }
    }
  };

  const createAlert = (alertData, type) => {
    const endpoint = type === "event" ? "api/event_alerts" : "api/category_alerts";
    
    fetch(`${backendUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alertData),
    })
    .then((response) => response.json())
    .then((newAlertData) => {
      // Reset form state
      setSelectedItem("");
      setNotificationMethod("email");
      setTrackingType("event");
      setIsDialogOpen(false);
      
      // Update the appropriate alerts list
      if (type === "event") {
        setEventAlerts((prevAlerts) => [...(prevAlerts || []), newAlertData]);
      } else {
        setCategoryAlerts((prevAlerts) => [...(prevAlerts || []), newAlertData]);
      }
    })
    .catch((error) => {
      console.error("Error creating alert:", error);
    });
  };

  const handleDeleteAlert = (event, id, type) => {
    event.preventDefault();
    const confirmed = window.confirm(
        "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      fetch(`${backendUrl}/api/${type}_alerts/${id}`, {
          method: "DELETE",
      })
      .then((data) => {
        if (type === "event") {
          setEventAlerts(eventAlerts.filter((a) => a.id !== id));
        } else {
          setCategoryAlerts(categoryAlerts.filter((a) => a.id !== id));
        };
      });
    };
  };

  const handleTrackingTypeChange = (value) => {
    setTrackingType(value)
    if (value === "event") {
        setOptions(eventOptions)
    } else {
        setOptions(categoryOptions)
    }
  }

  const [eventOptions, setEventOptions] = useState([]);
  useEffect(() => {
      fetch(
        `${backendUrl}/api/event_names`
      )
        .then((response) => response.json())
        .then((data) => {
          setEventOptions(data);
          setOptions(data)
        });
    }, []);

  const [categoryOptions, setCategoryOptions] = useState([]);
  useEffect(() => {
      fetch(
        `${backendUrl}/api/category_names`
      )
        .then((response) => response.json())
        .then((data) => {
          // Extract just the names from the category objects
          setCategoryObject(data);
          const categoryNames = data.map(category => category.name);
          setCategoryOptions(categoryNames);
        });
    }, []);

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event, value) => {
      // event.preventDefault()
      setSearchValue(value);

      // Dynamically update options based on the tracking type
      if (trackingType === "event") {
          setOptions(eventOptions?.filter(option => option?.toLowerCase().includes(value.toLowerCase())));
      } else {
          setOptions(categoryOptions?.filter(option => option?.toLowerCase().includes(value.toLowerCase())));
      }
  };

  const handleSelectedItem = (newValue) => {
    setSelectedItem(newValue)
  }

  const handlePriceThreshold = (e) => {
    setPriceThreshold(e.target.value)
  }

  return (
    <> 
    <Box sx={{ minHeight: "100vh", paddingTop: { xs: '50px', sm: '75px' }, }}>
      {user ? (
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }} >
          <Typography variant="h2" sx={{ fontWeight: 500 }}>
            Alerts
          </Typography>
          {/* <FormControl sx={{ minWidth: 180 }}>
            <Select value={showType} onChange={(e) => setShowType(e.target.value)} >
              <MenuItem value="Broadway">Broadway</MenuItem>
              <MenuItem value="Off-Broadway">Off-Broadway</MenuItem>
            </Select>
          </FormControl> */}
        </Box>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Set alerts to receive emails whenever tickets are selling below your max price. Manage your alerts here.
        </Typography>

        {/* Current Alerts */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
            Current Alerts
          </Typography>
          <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row'} }}>
            {/* Left side: event alerts */}
            <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
              Events
            </Typography>
              {eventAlerts?.length > 0 ? (
                eventAlerts.map((alert) => (
                  <Paper
                    key={alert.id}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: "2px solid",
                      borderColor: "grey.200",
                      borderRadius: 4,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                      <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 3, display: "inline-block"}}>
                        {getMethodIcon(alert.notification_method || "email")}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                          {alert.event.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                          {/* Price Display/Edit */}
                          <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {editingAlert === alert ? (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                  {editingPriceType === "percentage" ? "Discount:" : "Price:"}
                                </Typography>
                                <ToggleButtonGroup
                                  value={editingPriceType}
                                  exclusive
                                  onChange={(event, newValue) => {
                                    setEditingPriceType(newValue);
                                    // Keep the current value when switching types
                                  }}
                                  sx={{
                                    '& .MuiToggleButtonGroup-grouped': {
                                      margin: 0,
                                      border: 0,
                                      '&:not(:first-of-type)': {
                                        borderRadius: 0,
                                      },
                                      '&:first-of-type': {
                                        borderRadius: 0,
                                      },
                                    },
                                  }}
                                >
                                  <ToggleButton value="specific" sx={{ borderRadius: 0 }}>
                                    $
                                  </ToggleButton>
                                  <ToggleButton value="percentage" sx={{ borderRadius: 0 }}>
                                    %
                                  </ToggleButton>
                                </ToggleButtonGroup>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={editingPrice}
                                  onChange={(e) => setEditingPrice(e.target.value)}
                                  sx={{ width: 80 }}
                                  InputProps={{
                                    startAdornment: editingPriceType === "percentage" ? null : <span>$</span>,
                                    endAdornment: editingPriceType === "percentage" ? <span>%</span> : null,
                                  }}
                                />
                              </Box>
                            ) : (
                              <>
                                {alert.price_number ? (
                                  `$${alert.price_number}`
                                ) : alert.price_percent ? (
                                  `${alert.price_percent}%`
                                ) : (
                                  `$${alert.price_number || alert.price}`
                                )}
                              </>
                            )}
                          </Typography>

                          {/* Date Range Display/Edit */}
                          {(alert.start_date || alert.end_date || editingAlert === alert) && (
                            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {editingAlert === alert ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                    Date Range:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="date"
                                    value={editingStartDate}
                                    onChange={(e) => setEditingStartDate(e.target.value)}
                                    sx={{ width: 120 }}
                                    placeholder="Start"
                                  />
                                  <TextField
                                    size="small"
                                    type="date"
                                    value={editingEndDate}
                                    onChange={(e) => setEditingEndDate(e.target.value)}
                                    sx={{ width: 120 }}
                                    placeholder="End"
                                  />
                                </Box>
                              ) : (
                                <>
                                  {alert.start_date && alert.end_date ? (
                                    `${new Date(alert.start_date).toLocaleDateString()} - ${new Date(alert.end_date).toLocaleDateString()}`
                                  ) : alert.start_date ? (
                                    `From: ${new Date(alert.start_date).toLocaleDateString()}`
                                  ) : (
                                    `Until: ${new Date(alert.end_date).toLocaleDateString()}`
                                  )}
                                </>
                              )}
                            </Typography>
                          )}

                          {/* Show Time Display/Edit */}
                          {(alert.show_time || editingAlert === alert) && (
                            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {editingAlert === alert ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                    Show Time:
                                  </Typography>
                                  <FormControl size="small" sx={{ minWidth: 100 }}>
                                    <Select
                                      value={editingShowTime}
                                      onChange={(e) => setEditingShowTime(e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="">Any Time</MenuItem>
                                      <MenuItem value="matinee">Matinee</MenuItem>
                                      <MenuItem value="evening">Evening</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              ) : (
                                <>
                                  {alert.show_time === "matinee" ? "Matinee" : 
                                   alert.show_time === "evening" ? "Evening" : 
                                   "Any Time"}
                                </>
                              )}
                            </Typography>
                          )}

                          {/* Weekday Display/Edit */}
                          {(alert.weekday || editingAlert === alert) && (
                            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {editingAlert === alert ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                    Weekdays:
                                  </Typography>
                                  <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <Select
                                      multiple
                                      value={editingWeekdays}
                                      onChange={(e) => setEditingWeekdays(e.target.value)}
                                      displayEmpty
                                      renderValue={(selected) => {
                                        if (selected.length === 0) return "Any Day";
                                        if (selected.length === 7) return "Every Day";
                                        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                        return selected.map(day => weekdays[day]).join(', ');
                                      }}
                                    >
                                      <MenuItem value={0}>Sunday</MenuItem>
                                      <MenuItem value={1}>Monday</MenuItem>
                                      <MenuItem value={2}>Tuesday</MenuItem>
                                      <MenuItem value={3}>Wednesday</MenuItem>
                                      <MenuItem value={4}>Thursday</MenuItem>
                                      <MenuItem value={5}>Friday</MenuItem>
                                      <MenuItem value={6}>Saturday</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              ) : (
                                <>
                                  {alert.weekday && alert.weekday.length > 0 ? (
                                    (() => {
                                      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                      let weekdayArray = alert.weekday;
                                      
                                      // Handle weekday data conversion (could be array, string, or null)
                                      if (typeof alert.weekday === 'string') {
                                        try {
                                          weekdayArray = JSON.parse(alert.weekday);
                                        } catch (e) {
                                          weekdayArray = [];
                                        }
                                      }
                                      
                                      if (weekdayArray.length === 7) return "Every Day";
                                      return weekdayArray.map(day => weekdays[day]).join(', ');
                                    })()
                                  ) : (
                                    "Any Day"
                                  )}
                                </>
                              )}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    {loadingAlerts.has(alert.id) ? (
                      <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10, p: 0.5 }}>
                        <CircularProgress size={20} />
                      </Box>
                    ) : editingAlert === alert ? 
                      <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10, p: 0.5 }}>
                        <IconButton size="small" onClick={() => handlePatch(alert.id, "event")}>
                          <Check />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          setEditingAlert(null);
                          setEditingPrice("");
                          setEditingPriceType("specific");
                          setEditingStartDate("");
                          setEditingEndDate("");
                          setEditingShowTime("");
                          setEditingWeekdays([]);
                        }}>
                          <Close />
                        </IconButton>
                      </Box>
                    : 
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleEdit(alert)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={(e) => handleDeleteAlert(e, alert.id, alert.event ? "event" : "category")}>
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  </Paper>
                ))
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "2px solid",
                    borderColor: "grey.200",
                    borderRadius: 4,
                    textAlign: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    You have no event alerts.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create one below to see it here.
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Right side: category alerts */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
                Categories
              </Typography>
              {categoryAlerts?.length > 0 ? (
                categoryAlerts.map((alert) => (
                  <Paper
                    key={alert.id}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      border: "2px solid",
                      borderColor: "grey.200",
                      borderRadius: 4,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2, // Add some space between items
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                      <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 3 }}>
                        {getMethodIcon(alert.notification_method || "email")}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                          {alert.category.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                          {/* Price Display/Edit */}
                          <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {editingAlert === alert ? (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                  {editingPriceType === "percentage" ? "Discount:" : "Price:"}
                                </Typography>
                                <ToggleButtonGroup
                                  value={editingPriceType}
                                  exclusive
                                  onChange={(event, newValue) => {
                                    setEditingPriceType(newValue);
                                    // Keep the current value when switching types
                                  }}
                                  sx={{
                                    '& .MuiToggleButtonGroup-grouped': {
                                      margin: 0,
                                      border: 0,
                                      '&:not(:first-of-type)': {
                                        borderRadius: 0,
                                      },
                                      '&:first-of-type': {
                                        borderRadius: 0,
                                      },
                                    },
                                  }}
                                >
                                  <ToggleButton value="specific" sx={{ borderRadius: 0 }}>
                                    $
                                  </ToggleButton>
                                  <ToggleButton value="percentage" sx={{ borderRadius: 0 }}>
                                    %
                                  </ToggleButton>
                                </ToggleButtonGroup>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={editingPrice}
                                  onChange={(e) => setEditingPrice(e.target.value)}
                                  sx={{ width: 80 }}
                                  InputProps={{
                                    startAdornment: editingPriceType === "percentage" ? null : <span>$</span>,
                                    endAdornment: editingPriceType === "percentage" ? <span>%</span> : null,
                                  }}
                                />
                              </Box>
                            ) : (
                              <>
                                {alert.price_number ? (
                                  `$${alert.price_number}`
                                ) : alert.price_percent ? (
                                  `${alert.price_percent}%`
                                ) : (
                                  `$${alert.price_number || alert.price}`
                                )}
                              </>
                            )}
                          </Typography>

                          {/* Date Range Display/Edit */}
                          {(alert.start_date || alert.end_date || editingAlert === alert) && (
                            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {editingAlert === alert ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                    Date Range:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="date"
                                    value={editingStartDate}
                                    onChange={(e) => setEditingStartDate(e.target.value)}
                                    sx={{ width: 120 }}
                                    placeholder="Start"
                                  />
                                  <TextField
                                    size="small"
                                    type="date"
                                    value={editingEndDate}
                                    onChange={(e) => setEditingEndDate(e.target.value)}
                                    sx={{ width: 120 }}
                                    placeholder="End"
                                  />
                                </Box>
                              ) : (
                                <>
                                  {alert.start_date && alert.end_date ? (
                                    `${new Date(alert.start_date).toLocaleDateString()} - ${new Date(alert.end_date).toLocaleDateString()}`
                                  ) : alert.start_date ? (
                                    `From: ${new Date(alert.start_date).toLocaleDateString()}`
                                  ) : (
                                    `Until: ${new Date(alert.end_date).toLocaleDateString()}`
                                  )}
                                </>
                              )}
                            </Typography>
                          )}

                          {/* Show Time Display/Edit */}
                          {(alert.show_time || editingAlert === alert) && (
                            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {editingAlert === alert ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                    Show Time:
                                  </Typography>
                                  <FormControl size="small" sx={{ minWidth: 100 }}>
                                    <Select
                                      value={editingShowTime}
                                      onChange={(e) => setEditingShowTime(e.target.value)}
                                      displayEmpty
                                    >
                                      <MenuItem value="">Any Time</MenuItem>
                                      <MenuItem value="matinee">Matinee</MenuItem>
                                      <MenuItem value="evening">Evening</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              ) : (
                                <>
                                  {alert.show_time === "matinee" ? "Matinee" : 
                                   alert.show_time === "evening" ? "Evening" : 
                                   "Any Time"}
                                </>
                              )}
                            </Typography>
                          )}

                          {/* Weekday Display/Edit */}
                          {(alert.weekday || editingAlert === alert) && (
                            <Typography color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {editingAlert === alert ? (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                                    Weekdays:
                                  </Typography>
                                  <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <Select
                                      multiple
                                      value={editingWeekdays}
                                      onChange={(e) => setEditingWeekdays(e.target.value)}
                                      displayEmpty
                                      renderValue={(selected) => {
                                        if (selected.length === 0) return "Any Day";
                                        if (selected.length === 7) return "Every Day";
                                        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                        return selected.map(day => weekdays[day]).join(', ');
                                      }}
                                    >
                                      <MenuItem value={0}>Sunday</MenuItem>
                                      <MenuItem value={1}>Monday</MenuItem>
                                      <MenuItem value={2}>Tuesday</MenuItem>
                                      <MenuItem value={3}>Wednesday</MenuItem>
                                      <MenuItem value={4}>Thursday</MenuItem>
                                      <MenuItem value={5}>Friday</MenuItem>
                                      <MenuItem value={6}>Saturday</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              ) : (
                                <>
                                  {alert.weekday && alert.weekday.length > 0 ? (
                                    (() => {
                                      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                      let weekdayArray = alert.weekday;
                                      
                                      // Handle weekday data conversion (could be array, string, or null)
                                      if (typeof alert.weekday === 'string') {
                                        try {
                                          weekdayArray = JSON.parse(alert.weekday);
                                        } catch (e) {
                                          weekdayArray = [];
                                        }
                                      }
                                      
                                      if (weekdayArray.length === 7) return "Every Day";
                                      return weekdayArray.map(day => weekdays[day]).join(', ');
                                    })()
                                  ) : (
                                    "Any Day"
                                  )}
                                </>
                              )}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    {loadingAlerts.has(alert.id) ? (
                      <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10, p: 0.5 }}>
                        <CircularProgress size={20} />
                      </Box>
                    ) : editingAlert === alert ? 
                      <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10, p: 0.5 }}>
                        <IconButton size="small" onClick={() => handlePatch(alert.id, "category")}>
                          <Check />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          setEditingAlert(null);
                          setEditingPrice("");
                          setEditingPriceType("specific");
                          setEditingStartDate("");
                          setEditingEndDate("");
                          setEditingShowTime("");
                          setEditingWeekdays([]);
                        }}>
                          <Close />
                        </IconButton>
                      </Box>
                    : 
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton onClick={() => handleEdit(alert)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={(e) => handleDeleteAlert(e, alert.id, alert.event ? "event" : "category")}>
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  </Paper>
                ))
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "2px solid",
                    borderColor: "grey.200",
                    borderRadius: 4,
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    You have no category alerts.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create one below to see it here.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Add New Alert */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={() => {
            setEditingAlert(null);
            setIsDialogOpen(true);
          }}
          sx={{
            bgcolor: "black",
            color: "white",
            py: 2,
            borderRadius: 4,
            fontSize: "1.1rem",
            "&:hover": {
              bgcolor: "rgb(45, 45, 45)",
            },
            marginBottom: "2rem"
          }}
        >
          Add New Alert
        </Button>

        {/* Alert Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h4">
                Add New Alert
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={notificationMethod}
                  onChange={(e) => setNotificationMethod(e.target.value)}
                  displayEmpty
                  sx={{ 
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 1,
                    },
                  }}
                >
                  <MenuItem value="email" sx={{ fontSize: '0.9rem' }}>
                    <Email sx={{ mr: 1, fontSize: '1.1rem' }} /> Email Notification
                  </MenuItem>
                  <MenuItem value="sms" sx={{ fontSize: '0.9rem' }}>
                    <Lock sx={{ mr: 1, fontSize: '1.1rem' }} /> SMS Notification
                  </MenuItem>
                  <MenuItem value="push" disabled sx={{ fontSize: '0.9rem' }}>
                    <NotificationsActive sx={{ mr: 1, fontSize: '1.1rem' }} /> Push Notification
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <IconButton onClick={() => setIsDialogOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AlertForm
              onClose={() => setIsDialogOpen(false)}
              initialData={editingAlert}
              handleSubmit={handleSubmit}
              trackingType={trackingType}
              selectedItem={selectedItem}
              notificationMethod={notificationMethod}
              priceThreshold={priceThreshold}
              handleTrackingTypeChange={handleTrackingTypeChange}
              setOptions={setOptions}
              options={options}
              handleSearchChange={handleSearchChange}
              searchValue={searchValue}
              handleSelectedItem={handleSelectedItem}
              handlePriceThreshold={handlePriceThreshold}
            />
          </DialogContent>
        </Dialog>
      </Container>      
      ) : (
        <Container maxWidth="sm" sx={{ textAlign: 'center', }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
            Sign in to create and view your saved notifications
          </Typography>
          <Button variant="contained" href="/login">Sign In</Button>
        </Container>
      )}
    </Box>
    </>
  );
};

export default AlertsPage;
