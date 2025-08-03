import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, Paper, MenuItem, Grid, ToggleButtonGroup, ToggleButton, InputAdornment, FormControl, Select } from "@mui/material";
import { Email, Sms, NotificationsActive, Refresh, Add, Edit, Delete, Close, Check } from "@mui/icons-material";
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
  const [trackingType, setTrackingType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [emailBool, setEmailBool] = useState(true);
  const [smsBool, setSmsBool] = useState(false);
  const [pushBool, setPushBool] = useState(false);
  const [priceThreshold, setPriceThreshold] = useState(0);
  const [options, setOptions] = useState([]);
  const [updatedId, setUpdatedId] = useState({})

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setPriceThreshold(alert?.price);
    // setIsDialogOpen(true);
  };

  const handlePatch = (id, type) => {
    fetch(`${backendUrl}/api/${type}_alerts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          price: priceThreshold,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
      setUpdatedId({"id": id, "price": priceThreshold})
      setPriceThreshold(0)
      setEditingAlert(null);
    })
  }

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const alertData = {
        user_id: user.id,
        [trackingType === "event" ? "event_name" : "category_name"]: selectedItem,
        price: priceThreshold,
        send_email: emailBool,
        send_sms: smsBool,
        send_push: pushBool,
    };
    const endpoint = (trackingType === "event") ? "api/event_alerts" : "api/category_alerts";
    fetch(`${backendUrl}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/JSON",
        },
        body: JSON.stringify(alertData),
    })
    .then((response) => response.json())
    .then((newAlertData) => {
        setSelectedItem();
        setPriceThreshold();
        if (trackingType === "event") {
          setEventAlerts((prevAlerts) => [
            ...(prevAlerts || []), // Spread existing array
            newAlertData,          // Append new data
          ]);
        } else {
          setCategoryAlerts((prevAlerts) => [
              ...(prevAlerts || []), // Spread existing array
              newAlertData,          // Append new data
          ]);
        }
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
          setCategoryOptions(data);
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
              {eventAlerts?.map((alert) => (
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
                    <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 3, display: "inline-block"}}>
                      {getMethodIcon("email")}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {alert.event.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Max Price:{" "}
                        {editingAlert === alert ? (
                          <TextField
                            // defaultValue={alert.price} 
                            onChange={(event) => handlePriceThreshold(event)} // Handle changes
                            variant="outlined" // Use a compact variant
                            type="number"
                            value={priceThreshold}
                            inputProps={{
                              style: {
                                fontSize: "inherit", // Match the font size to the surrounding text
                                padding: 0, // Remove extra padding
                                textAlign: "center", // Center align if necessary
                              },
                              startAdornment: <span>$</span>,
                            }}
                            sx={{
                              width: "50px", 
                              // minWidth: "50px", // Set a minimum width for stability
                              fontWeight: 500, // Match the font weight
                            }}
                          />
                        ) : (
                          <Box component="span" sx={{ fontWeight: 500 }}>
                            ${(updatedId && (updatedId.id === alert.id)) ? updatedId.price : alert.price}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  {editingAlert === alert ? 
                    <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10 }}>
                      <IconButton onClick={() => handlePatch(alert.id, "event")}>
                        <Check />
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
              ))}
            </Grid>

            {/* Right side: category alerts */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
                Categories
              </Typography>
              {categoryAlerts?.map((alert) => (
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
                    mb: 2, // Add some space between items
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 3 }}>
                      {getMethodIcon("email")}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {alert.category.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Max Price:{" "}
                        {editingAlert === alert ? (
                          <TextField
                            defaultValue={alert.price} // Default value for editing
                            onChange={(event) => handlePriceThreshold(event)} // Handle changes
                            variant="outlined" // Use a compact variant
                            type="number"
                            value={priceThreshold}
                            inputProps={{
                              style: {
                                fontSize: "inherit", // Match the font size to the surrounding text
                                padding: 0, // Remove extra padding
                                textAlign: "center", // Center align if necessary
                              },
                            }}
                            sx={{
                              width: "50px", // Auto-adjust width to content
                              minWidth: "50px", // Set a minimum width for stability
                              fontWeight: 500, // Match the font weight
                            }}
                          />
                        ) : (
                          <Box component="span" sx={{ fontWeight: 500 }}>
                            ${(updatedId && (updatedId.id === alert.id)) ? updatedId.price : alert.price}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  {editingAlert === alert ? 
                    <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10 }}>
                      <IconButton onClick={() => handlePatch(alert.id, "category")}>
                        <Check />
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
              ))}
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
            <Typography variant="h4">
              Add New Alert
            </Typography>
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
              emailBool={emailBool}
              smsBool={smsBool}
              pushBool={pushBool}
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
