import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { Container, Typography, Box, Paper, Grid, Accordion, AccordionSummary, AccordionDetails, CircularProgress, TextField, Stack } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Error from '../Error';
import "./userAlerts.css";

const groupBy = (arr, keyFn) => {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
};

const UserAlerts = () => {
  const { backendUrl } = useOutletContext();
  const { user } = useOutletContext();

  // Helper function to format alert details
  const formatAlertDetails = (alert) => {
    const details = [];
    
    // Price information
    if (alert.price_number) {
      details.push(`Max Price: $${alert.price_number}`);
    } else if (alert.price_percent) {
      details.push(`Min Discount: ${alert.price_percent}%`);
    }
    
    // Date range
    if (alert.start_date && alert.end_date) {
      details.push(`Date Range: ${new Date(alert.start_date).toLocaleDateString()} - ${new Date(alert.end_date).toLocaleDateString()}`);
    } else if (alert.start_date) {
      details.push(`From: ${new Date(alert.start_date).toLocaleDateString()}`);
    } else if (alert.end_date) {
      details.push(`Until: ${new Date(alert.end_date).toLocaleDateString()}`);
    }
    
    // Show time
    if (alert.show_time) {
      details.push(`Show Time: ${alert.show_time === 'matinee' ? 'Matinee' : 'Evening'}`);
    }
    
    // Weekdays
    if (alert.weekday && alert.weekday.length > 0) {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      if (alert.weekday.length === 7) {
        details.push('Weekdays: Every Day');
      } else {
        const selectedDays = alert.weekday.map(day => weekdays[day]).join(', ');
        details.push(`Weekdays: ${selectedDays}`);
      }
    }
    
    // Time to show
    if (alert.time_to_show) {
      details.push(`Min Hours Before Show: ${alert.time_to_show}`);
    }
    
    // Notification method
    if (alert.notification_method) {
      details.push(`Notification: ${alert.notification_method.toUpperCase()}`);
    }
    
    return details;
  };

  const [userAlerts, setUserAlerts] = useState([]);
  const [userCategoryAlerts, setUserCategoryAlerts] = useState([]);
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch(`${backendUrl}/api/event_alerts`).then(res => res.json()),
      fetch(`${backendUrl}/api/category_alerts`).then(res => res.json())
    ]).then(([eventData, categoryData]) => {
      setUserAlerts(eventData);
      setUserCategoryAlerts(categoryData);
      setIsLoading(false);
    });
  }, [backendUrl]);

  // Group by user
  const eventAlertsByUser = groupBy(userAlerts, alert => `${alert.user.first_name} ${alert.user.last_name}`);
  const categoryAlertsByUser = groupBy(userCategoryAlerts, alert => `${alert.user.first_name} ${alert.user.last_name}`);

  // Group by show/event name
  const eventAlertsByShow = groupBy(userAlerts, alert => alert.event.name);
  const categoryAlertsByShow = groupBy(userCategoryAlerts, alert => alert.category.name);

  // Filter alerts by search (event/category/user)
  const filterAlerts = (alerts, type) => {
    if (!search) return alerts;
    const lowerSearch = search.toLowerCase();
    return alerts.filter(alert => {
      const userName = `${alert.user.first_name} ${alert.user.last_name}`.toLowerCase();
      if (type === "event") {
        return (
          alert.event.name.toLowerCase().includes(lowerSearch) ||
          userName.includes(lowerSearch)
        );
      } else {
        return (
          alert.category.name.toLowerCase().includes(lowerSearch) ||
          userName.includes(lowerSearch)
        );
      }
    });
  };

  // Handle expansion based on search
  useEffect(() => {
    if (!search) {
      setExpanded({});
      return;
    }
    const lowerSearch = search.toLowerCase();
    let newExpanded = {};
    if (tab === 0) {
      Object.entries(eventAlertsByUser).forEach(([userName, alerts]) => {
        if (
          userName.toLowerCase().includes(lowerSearch) ||
          alerts.some(alert => alert.event.name.toLowerCase().includes(lowerSearch))
        ) {
          newExpanded[`event-user-${userName}`] = true;
        }
      });
      Object.entries(categoryAlertsByUser).forEach(([userName, alerts]) => {
        if (
          userName.toLowerCase().includes(lowerSearch) ||
          alerts.some(alert => alert.category.name.toLowerCase().includes(lowerSearch))
        ) {
          newExpanded[`category-user-${userName}`] = true;
        }
      });
    } else if (tab === 1) {
      Object.entries(eventAlertsByShow).forEach(([showName, alerts]) => {
        if (
          showName.toLowerCase().includes(lowerSearch) ||
          alerts.some(alert =>
            alert.event.name.toLowerCase().includes(lowerSearch) ||
            `${alert.user.first_name} ${alert.user.last_name}`.toLowerCase().includes(lowerSearch)
          )
        ) {
          newExpanded[`event-show-${showName}`] = true;
        }
      });
      Object.entries(categoryAlertsByShow).forEach(([categoryName, alerts]) => {
        if (
          categoryName.toLowerCase().includes(lowerSearch) ||
          alerts.some(alert =>
            alert.category.name.toLowerCase().includes(lowerSearch) ||
            `${alert.user.first_name} ${alert.user.last_name}`.toLowerCase().includes(lowerSearch)
          )
        ) {
          newExpanded[`category-show-${categoryName}`] = true;
        }
      });
    }
    setExpanded(newExpanded);
  }, [search, tab, userAlerts, userCategoryAlerts]);

  // Manual expand/collapse handler
  const handleAccordionChange = key => (event, isExpanded) => {
    setExpanded(prev => ({
      ...prev,
      [key]: isExpanded
    }));
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (user?.id !== 8) {
    return <Error />;
  }

  const PRIMARY = "#156064";
  const PRIMARY_DARK = "#104e4e";
  const ACCORDION_BG = "#fff";
  const ACCORDION_DETAILS_BG = "#f8f8f8";
  const BUTTON_RADIUS = 20;

  return (
    <Container className='userAlerts__container'>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <button
            style={{
              background: tab === 0 ? PRIMARY_DARK : PRIMARY,
              color: "#fff",
              border: "none",
              borderRadius: BUTTON_RADIUS,
              padding: "8px 28px",
              fontSize: "1rem",
              fontWeight: 600,
              marginRight: 12,
              boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
              cursor: "pointer",
              letterSpacing: "0.5px",
              transition: "background 0.2s, color 0.2s"
            }}
            onClick={() => setTab(0)}
            type="button"
          >
            Group by User
          </button>
          <button
            style={{
              background: tab === 1 ? PRIMARY_DARK : PRIMARY,
              color: "#fff",
              border: "none",
              borderRadius: BUTTON_RADIUS,
              padding: "8px 28px",
              fontSize: "1rem",
              fontWeight: 600,
              marginRight: 12,
              boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
              cursor: "pointer",
              letterSpacing: "0.5px",
              transition: "background 0.2s, color 0.2s"
            }}
            onClick={() => setTab(1)}
            type="button"
          >
            Group by Show
          </button>
          <button
            style={{
              background: tab === 2 ? PRIMARY_DARK : PRIMARY,
              color: "#fff",
              border: "none",
              borderRadius: BUTTON_RADIUS,
              padding: "8px 28px",
              fontSize: "1rem",
              fontWeight: 600,
              marginRight: 12,
              boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
              cursor: "pointer",
              letterSpacing: "0.5px",
              transition: "background 0.2s, color 0.2s"
            }}
            onClick={() => setTab(2)}
            type="button"
          >
            All Alerts
          </button>
        </Stack>
        <Box sx={{ minWidth: 300 }}>
          <TextField
            label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: BUTTON_RADIUS,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
              '& .MuiOutlinedInput-root': {
                borderRadius: BUTTON_RADIUS,
                background: "#fff",
                border: "none"
              },
              '& .MuiInputLabel-root': {
                borderRadius: BUTTON_RADIUS,
                background: "transparent"
              }
            }}
          />
        </Box>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>Events</Typography>
          {tab === 0
            ? Object.entries(eventAlertsByUser)
                .map(([userName, alerts]) => {
                  const filteredAlerts = filterAlerts(alerts, "event");
                  return { userName, alerts, filteredAlerts };
                })
                .filter(({ filteredAlerts }) => filteredAlerts.length > 0)
                .sort((a, b) => b.filteredAlerts.length - a.filteredAlerts.length)
                .map(({ userName, alerts, filteredAlerts }) => {
                  const key = `event-user-${userName}`;
                  return (
                    <Accordion
                      key={userName}
                      expanded={!!expanded[key]}
                      onChange={handleAccordionChange(key)}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
                        background: ACCORDION_BG,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                        sx={{
                          background: expanded[key] ? PRIMARY_DARK : PRIMARY,
                          color: "#fff",
                          fontWeight: 600,
                          borderRadius: 2,
                          transition: "background 0.2s",
                          '&:hover': {
                            background: PRIMARY_DARK,
                            cursor: "pointer"
                          }
                        }}
                      >
                        <Typography>
                          {userName} ({filteredAlerts.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{
                        background: ACCORDION_DETAILS_BG,
                        borderRadius: "0 0 12px 12px"
                      }}>
                        {filteredAlerts.map(alert => (
                          <Paper key={alert.id} sx={{ p: 1, mb: 1 }}>
                            <Typography variant="subtitle1">{alert.event.name}</Typography>
                            {formatAlertDetails(alert).map((detail, index) => (
                              <Typography key={index} color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                {detail}
                              </Typography>
                            ))}
                          </Paper>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  );
                })
            : tab === 1
              ? Object.entries(eventAlertsByShow)
                  .map(([showName, alerts]) => {
                    const filteredAlerts = filterAlerts(alerts, "event");
                    return { showName, alerts, filteredAlerts };
                  })
                  .filter(({ filteredAlerts }) => filteredAlerts.length > 0)
                  .sort((a, b) => b.filteredAlerts.length - a.filteredAlerts.length)
                  .map(({ showName, alerts, filteredAlerts }) => {
                    const key = `event-show-${showName}`;
                    return (
                      <Accordion
                        key={showName}
                        expanded={!!expanded[key]}
                        onChange={handleAccordionChange(key)}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
                          background: ACCORDION_BG,
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                          sx={{
                            background: expanded[key] ? PRIMARY_DARK : PRIMARY,
                            color: "#fff",
                            fontWeight: 600,
                            borderRadius: 2,
                            transition: "background 0.2s",
                            '&:hover': {
                              background: PRIMARY_DARK,
                              cursor: "pointer"
                            }
                          }}
                        >
                          <Typography>
                            {showName} ({filteredAlerts.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                          background: ACCORDION_DETAILS_BG,
                          borderRadius: "0 0 12px 12px"
                        }}>
                          {filteredAlerts.map(alert => (
                            <Paper key={alert.id} sx={{ p: 1, mb: 1 }}>
                              <Typography variant="subtitle1">{`${alert.user.first_name} ${alert.user.last_name}`}</Typography>
                              {formatAlertDetails(alert).map((detail, index) => (
                                <Typography key={index} color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                  {detail}
                                </Typography>
                              ))}
                            </Paper>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
              : userAlerts
                  .filter(alert => {
                    if (!search) return true;
                    const lowerSearch = search.toLowerCase();
                    const userName = `${alert.user.first_name} ${alert.user.last_name}`.toLowerCase();
                    return (
                      alert.event.name.toLowerCase().includes(lowerSearch) ||
                      userName.includes(lowerSearch)
                    );
                  })
                  .sort((a, b) => b.id - a.id) // Sort by id descending (newest first)
                  .map(alert => (
                    <Paper key={alert.id} sx={{ p: 1, mb: 1 }}>
                      <Typography variant="subtitle1">
                        {alert.event.name} — {alert.user.first_name} {alert.user.last_name}
                      </Typography>
                      {formatAlertDetails(alert).map((detail, index) => (
                        <Typography key={index} color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {detail}
                        </Typography>
                      ))}
                      <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                        {alert.created_at ? new Date(alert.created_at).toLocaleString() : ""}
                      </Typography>
                    </Paper>
                  ))
          }
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 500 }}>Categories</Typography>
          {tab === 0
            ? Object.entries(categoryAlertsByUser)
                .map(([userName, alerts]) => {
                  const filteredAlerts = filterAlerts(alerts, "category");
                  return { userName, alerts, filteredAlerts };
                })
                .filter(({ filteredAlerts }) => filteredAlerts.length > 0)
                .sort((a, b) => b.filteredAlerts.length - a.filteredAlerts.length)
                .map(({ userName, alerts, filteredAlerts }) => {
                  const key = `category-user-${userName}`;
                  return (
                    <Accordion
                      key={userName}
                      expanded={!!expanded[key]}
                      onChange={handleAccordionChange(key)}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
                        background: ACCORDION_BG,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                        sx={{
                          background: expanded[key] ? PRIMARY_DARK : PRIMARY,
                          color: "#fff",
                          fontWeight: 600,
                          borderRadius: 2,
                          transition: "background 0.2s",
                          '&:hover': {
                            background: PRIMARY_DARK,
                            cursor: "pointer"
                          }
                        }}
                      >
                        <Typography>
                          {userName} ({filteredAlerts.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{
                        background: ACCORDION_DETAILS_BG,
                        borderRadius: "0 0 12px 12px"
                      }}>
                        {filteredAlerts.map(alert => (
                          <Paper key={alert.id} sx={{ p: 1, mb: 1 }}>
                            <Typography variant="subtitle1">{alert.category.name}</Typography>
                            {formatAlertDetails(alert).map((detail, index) => (
                              <Typography key={index} color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                {detail}
                              </Typography>
                            ))}
                          </Paper>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  );
                })
            : tab === 1
              ? Object.entries(categoryAlertsByShow)
                  .map(([categoryName, alerts]) => {
                    const filteredAlerts = filterAlerts(alerts, "category");
                    return { categoryName, alerts, filteredAlerts };
                  })
                  .filter(({ filteredAlerts }) => filteredAlerts.length > 0)
                  .sort((a, b) => b.filteredAlerts.length - a.filteredAlerts.length)
                  .map(({ categoryName, alerts, filteredAlerts }) => {
                    const key = `category-show-${categoryName}`;
                    return (
                      <Accordion
                        key={categoryName}
                        expanded={!!expanded[key]}
                        onChange={handleAccordionChange(key)}
                        sx={{
                          mb: 1,
                          borderRadius: 2,
                          boxShadow: "0 2px 8px rgba(21,96,100,0.08)",
                          background: ACCORDION_BG,
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                          sx={{
                            background: expanded[key] ? PRIMARY_DARK : PRIMARY,
                            color: "#fff",
                            fontWeight: 600,
                            borderRadius: 2,
                            transition: "background 0.2s",
                            '&:hover': {
                              background: PRIMARY_DARK,
                              cursor: "pointer"
                            }
                          }}
                        >
                          <Typography>
                            {categoryName} ({filteredAlerts.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{
                          background: ACCORDION_DETAILS_BG,
                          borderRadius: "0 0 12px 12px"
                        }}>
                          {filteredAlerts.map(alert => (
                            <Paper key={alert.id} sx={{ p: 1, mb: 1 }}>
                              <Typography variant="subtitle1">{`${alert.user.first_name} ${alert.user.last_name}`}</Typography>
                              {formatAlertDetails(alert).map((detail, index) => (
                                <Typography key={index} color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                  {detail}
                                </Typography>
                              ))}
                            </Paper>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })
              : userCategoryAlerts
                  .filter(alert => {
                    if (!search) return true;
                    const lowerSearch = search.toLowerCase();
                    const userName = `${alert.user.first_name} ${alert.user.last_name}`.toLowerCase();
                    return (
                      alert.category.name.toLowerCase().includes(lowerSearch) ||
                      userName.includes(lowerSearch)
                    );
                  })
                  .sort((a, b) => b.id - a.id) // Sort by id descending (newest first)
                  .map(alert => (
                    <Paper key={alert.id} sx={{ p: 1, mb: 1 }}>
                      <Typography variant="subtitle1">
                        {alert.category.name} — {alert.user.first_name} {alert.user.last_name}
                      </Typography>
                      {formatAlertDetails(alert).map((detail, index) => (
                        <Typography key={index} color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          {detail}
                        </Typography>
                      ))}
                      <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                        {alert.created_at ? new Date(alert.created_at).toLocaleString() : ""}
                      </Typography>
                    </Paper>
                  ))
          }
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserAlerts;