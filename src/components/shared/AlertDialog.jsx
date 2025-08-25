import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { Close, Email, Sms, NotificationsActive, Lock } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import AlertForm from "../alerts/AlertForm";

const AlertDialog = ({ open, onClose, eventName, eventId, categoryName }) => {
  const { user, backendUrl } = useOutletContext();
  
  const [trackingType, setTrackingType] = useState("event");
  const [selectedItem, setSelectedItem] = useState("");
  const [notificationMethod, setNotificationMethod] = useState("email");
  const [priceThreshold, setPriceThreshold] = useState(0);
  const [options, setOptions] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);

  // Set the selected item when the dialog opens
  useEffect(() => {
    if (open && eventName) {
      setSelectedItem(eventName);
    }
  }, [open, eventName]);

  // Fetch average price for the event when dialog opens
  useEffect(() => {
    if (open && eventId) {
      fetch(`${backendUrl}/api/events/${eventId}`)
        .then(response => response.json())
        .then(data => {
          setAveragePrice(data.event_info[0].average_lowest_price);
        })
        .catch(error => {
          console.error('Error fetching average price:', error);
        });
    }
  }, [open, eventId, backendUrl]);

  const handleSubmit = async (formData) => {
    try {
      // Map the form data to the backend API format
      const alertData = {
        user_id: user.id,
        event_id: eventId,
        event_name: eventName, // Backend expects this
        category_id: categoryName === "Broadway" ? 1 : 
                    categoryName === "Play" ? 2 : 
                    categoryName === "Concert" ? 3 : 1,
        tracking_type: formData.trackingType,
        notification_method: formData.notificationMethod,
        price_number: formData.priceNumber,
        price_percent: formData.pricePercent,
        start_date: formData.startDate,
        end_date: formData.endDate,
        show_time: formData.showTime,
        weekday: formData.weekday ? JSON.stringify(formData.weekday) : null,
        time_to_show: formData.timeToShow
      };

      const response = await fetch(`${backendUrl}/api/event_alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        onClose();
        // Show success message
        console.log('Alert created successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create alert');
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert: ' + error.message);
    }
  };

  const handleTrackingTypeChange = (event, newValue) => {
    if (newValue !== null) {
      setTrackingType(newValue);
    }
  };

  const handlePriceThreshold = (event) => {
    setPriceThreshold(event.target.value);
  };

  const handleSearchChange = (event) => {
    // This would be used for searching events/categories
    // For now, we'll leave it empty since we're pre-selecting the event
  };

  const handleSelectedItem = (event, newValue) => {
    setSelectedItem(newValue);
  };

  const handleSetOptions = (newOptions) => {
    // This would be used for setting search options
    // For now, we'll leave it empty
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 0.5, sm: 2 },
          width: { xs: 'calc(100% - 1px)', sm: 'auto' },
          maxWidth: { xs: 'none', sm: 'md' }
        }
      }}
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
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AlertForm
          onClose={onClose}
          initialData={null}
          handleSubmit={handleSubmit}
          trackingType={trackingType}
          selectedItem={selectedItem}
          notificationMethod={notificationMethod}
          priceThreshold={priceThreshold}
          handleTrackingTypeChange={handleTrackingTypeChange}
          setOptions={handleSetOptions}
          options={options}
          handleSearchChange={handleSearchChange}
          searchValue={selectedItem}
          handleSelectedItem={handleSelectedItem}
          handlePriceThreshold={handlePriceThreshold}
          onNotificationMethodChange={(method) => setNotificationMethod(method)}
          averagePrice={averagePrice}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
