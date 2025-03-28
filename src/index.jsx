import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import Error from "./components/Error.jsx";
import Home from "./components/home/Home.jsx";
import SignInSide from "./components/login/SignInSide.jsx";
import SignUp from "./components/login/SignUp";
import Alerts from "./components/alerts/Alerts.jsx";
import Event from "./components/event/Event.jsx";
import Date from "./components/date/Date.jsx";
import Enterprise from "./components/enterprise/Enterprise.jsx";
import UserAlerts from "./components/user-alerts/UserAlerts.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AddEvent from "./components/add-event/AddEvent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "login",
        element: <SignInSide />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "alerts",
        element: <Alerts />,
      },
      {
        path: "event/:id",
        element: <Event />,
      },
      {
        path: "date",
        element: <Date />,
      },
      {
        path: "enterprise",
        element: <Enterprise />,
      },
      {
        path: "user-alerts",
        element: <UserAlerts />,
      },
      {
        path: "add-event",
        element: <AddEvent />,
      },
      //   {
      //     path: "recipes/:id",
      //     element: <IndividualRecipe />,
      //   },
      //   {
      //     path: "user/:id",
      //     element: <ProfilePage />,
      //   }
    ],
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      main: "#333333",
      // main: "#00C49A",
      // light: "",
      // dark: "",
      // contrastText: "#",
    },
    secondary: {
      main: "#156064",
    },
    // error: {
    //   main: '#'
    // },
    // warning: {
    //   main: '#'
    // },
    info: {
      main: "#F8E16C",
    },
    success: {
      main: "#FFC2B4",
    },
    background: {
      main: "#FB8F67",
    },
    // text: {
    //   main: '#'
    // },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 600,
      color: "#156064",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#156064",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#156064",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="68239072322-mbgrg9nqj0iu0c6na572ea88blgodj54.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
