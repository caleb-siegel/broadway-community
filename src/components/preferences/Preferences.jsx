import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, TextField, Dialog, DialogContent, DialogTitle, IconButton, Paper, MenuItem, Grid, ToggleButtonGroup, ToggleButton, InputAdornment, FormControl, Select } from "@mui/material";
import { Email, Sms, NotificationsActive, Refresh, Add, Edit, Delete, Close, Check } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import PreferenceForm from "./PreferenceForm";
import "./preferences.css";

const PreferencesPage = () => {

  const { user } = useOutletContext();
  const { backendUrl } = useOutletContext();

  // useEffect(() => {
  //   if (user) {
  //     setEventPreferences(user.event_preferences || []);
  //     setCategoryPreferences(user.category_preferences || []);
  //   }
  // }, [user]);

  const [eventPreferences, setEventPreferences] = useState(user?.event_preferences || []);
  const [categoryPreferences, setCategoryPreferences] = useState(user?.category_preferences || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPreference, setEditingPreference] = useState(null);
  const [showType, setShowType] = useState("Broadway");
  const [trackingType, setTrackingType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [emailBool, setEmailBool] = useState(true);
  const [smsBool, setSmsBool] = useState(false);
  const [pushBool, setPushBool] = useState(false);
  const [priceThreshold, setPriceThreshold] = useState(0);
  const [options, setOptions] = useState([]);
  const [updatedId, setUpdatedId] = useState({})

  const handleEdit = (preference) => {
    setEditingPreference(preference);
    setPriceThreshold(preference?.price);
    // setIsDialogOpen(true);
  };

  const handlePatch = (id, type) => {
    fetch(`${backendUrl}/api/${type}_preferences/${id}`, {
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
      console.log("edited")
      setUpdatedId({"id": id, "price": priceThreshold})
      setPriceThreshold(0)
      setEditingPreference(null);
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
    const preferenceData = {
        user_id: user.id,
        [trackingType === "event" ? "event_name" : "category_name"]: selectedItem,
        price: priceThreshold,
        send_email: emailBool,
        send_sms: smsBool,
        send_push: pushBool,
    };
    const endpoint = (trackingType === "event") ? "api/event_preferences" : "api/category_preferences";
    fetch(`${backendUrl}/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/JSON",
        },
        body: JSON.stringify(preferenceData),
    })
    .then((response) => response.json())
    .then((newPreferenceData) => {
        setSelectedItem();
        setPriceThreshold();
        if (trackingType === "event") {
          setEventPreferences((prevPreferences) => [
            ...(prevPreferences || []), // Spread existing array
            newPreferenceData,          // Append new data
          ]);
        } else {
          setCategoryPreferences((prevPreferences) => [
              ...(prevPreferences || []), // Spread existing array
              newPreferenceData,          // Append new data
          ]);
        }
    });
  };

  const handleDeletePreference = (event, id, type) => {
    event.preventDefault();
    const confirmed = window.confirm(
        "Are you sure you want to delete this item?"
    );
    console.log(`${backendUrl}/api/${type}_preferences/${id}`)
    if (confirmed) {
      fetch(`${backendUrl}/api/${type}_preferences/${id}`, {
          method: "DELETE",
      })
      .then((data) => {
        console.log("delete successful")
        if (type === "event") {
          setEventPreferences(eventPreferences.filter((p) => p.id !== id));
        } else {
          setCategoryPreferences(categoryPreferences.filter((p) => p.id !== id));
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
            Preferences
          </Typography>
          {/* <FormControl sx={{ minWidth: 180 }}>
            <Select value={showType} onChange={(e) => setShowType(e.target.value)} >
              <MenuItem value="Broadway">Broadway</MenuItem>
              <MenuItem value="Off-Broadway">Off-Broadway</MenuItem>
            </Select>
          </FormControl> */}
        </Box>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Set notification preferences to receive alerts whenever tickets are selling below your max price. Manage your preferences here.
        </Typography>

        {/* Current Preferences */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
            Current Preferences
          </Typography>
          <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row'} }}>
            {/* Left side: event preferences */}
            <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
              Events
            </Typography>
              {eventPreferences?.map((pref) => (
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
                    <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 3, display: "inline-block"}}>
                      {getMethodIcon("email")}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {pref.event.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Max Price:{" "}
                        {editingPreference === pref ? (
                          <TextField
                            // defaultValue={pref.price} 
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
                            ${(updatedId && (updatedId.id === pref.id)) ? updatedId.price : pref.price}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  {editingPreference === pref ? 
                    <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10 }}>
                      <IconButton onClick={() => handlePatch(pref.id, "event")}>
                        <Check />
                      </IconButton>
                    </Box>
                  : 
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton onClick={() => handleEdit(pref)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={(e) => handleDeletePreference(e, pref.id, pref.event ? "event" : "category")}>
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                </Paper>
              ))}
            </Grid>

            {/* Right side: category preferences */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>
                Categories
              </Typography>
              {categoryPreferences?.map((pref) => (
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
                    mb: 2, // Add some space between items
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 3 }}>
                      {getMethodIcon("email")}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {pref.category.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Max Price:{" "}
                        {editingPreference === pref ? (
                          <TextField
                            defaultValue={pref.price} // Default value for editing
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
                            ${(updatedId && (updatedId.id === pref.id)) ? updatedId.price : pref.price}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  {editingPreference === pref ? 
                    <Box sx={{ display: "flex", gap: 1, border: '1px solid grey', borderRadius: 10 }}>
                      <IconButton onClick={() => handlePatch(pref.id, "category")}>
                        <Check />
                      </IconButton>
                    </Box>
                  : 
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton onClick={() => handleEdit(pref)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={(e) => handleDeletePreference(e, pref.id, pref.event ? "event" : "category")}>
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                </Paper>
              ))}
            </Grid>
          </Grid>
        </Box>

        {/* Add New Preference */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<Add />}
          onClick={() => {
            setEditingPreference(null);
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
          Add New Preference
        </Button>

        {/* Preference Dialog */}
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
              Add New Preference
            </Typography>
            <IconButton onClick={() => setIsDialogOpen(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <PreferenceForm
              onClose={() => setIsDialogOpen(false)}
              initialData={editingPreference}
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

export default PreferencesPage;
