import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import Error from './components/Error.jsx';
import Home from './components/home/Home.jsx';
import SignInSide from './components/login/SignInSide.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "login",
        element: <SignInSide />,
      },
    //   {
    //     path: "recipes/:id",
    //     element: <IndividualRecipe />,
    //   },
    //   {
    //     path: "user/:id",
    //     element: <ProfilePage />,
    //   }
    ]
  }
])

const theme = createTheme({
  palette: {
    primary: {
      main: "#00C49A",
      // light: "",
      // dark: "",
      // contrastText: "#",
    },
    secondary: {
      main: '#156064'
    },
    // error: {
    //   main: '#'
    // },
    // warning: {
    //   main: '#'
    // },
    info: {
      main: '#F8E16C'
    },
    success: {
      main: '#FFC2B4'
    },
    background: {
      main: '#FB8F67'
    },
    // text: {
    //   main: '#'
    // },
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 600,
      color: '#156064'
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: '#156064'
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: '#156064'
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
