import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import Navbar from './Navbar';
import { Analytics } from "@vercel/analytics/react"


function App() {
  const [count, setCount] = useState(0)

  // const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   fetch(`/api/check_session`).then((res) => {
  //       if (res.ok) {
  //           res.json().then((user) => setUser(user));
  //       }
  //   });
  // }, []);

  // function attemptLogin(userInfo) {
  //   fetch(`/api/login`, {
  //       method: "POST",
  //       headers: {
  //           "Content-Type": "application/json",
  //           "Accepts": "application/json",
  //       },
  //       body: JSON.stringify(userInfo),
  //   })
  //       .then((res) => {
  //           if (res.ok) {
  //               return res.json();
  //           }
  //           throw res;
  //       })
  //       .then((data) => {
  //           setUser(data);
  //           console.log(data)
  //           navigate("/recipes");
  //       })
  //       .catch((e) => {
  //           alert('incorrect username or password')
  //           console.log(e);
  //       });
  // }
  // function logout() {
  //   fetch(`/api/logout`, { method: "DELETE" }).then((res) => {
  //       if (res.ok) {
  //           setUser(null);
  //       }
  //   });
  // }

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', width: '100%', padding: '0px'}}>
      <Typography component={'span'}>
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
        <Outlet />
      </Typography>
      <Analytics /> 
    </Container>
  )
}

export default App
