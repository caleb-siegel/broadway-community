import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import Navbar from './Navbar';


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
    <>
      <Container disableGutters maxWidth={false} sx={{ height: '100vh', width: '100%', padding: '0px'}}>
        <Typography component={'span'}>
          <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode}/>
          <Outlet />
        </Typography>
      </Container>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
