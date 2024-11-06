import React, { useState, useEffect } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { useNavigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://broadwaycommunity-backend.vercel.app/api/check_session`).then((res) => {
        if (res.ok) {
            res.json().then((user) => setUser(user));
        }
    });
  }, []);

  function attemptLogin(userInfo) {
    fetch(`https://broadwaycommunity-backend.vercel.app/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json",
        },
        body: JSON.stringify(userInfo),
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw res;
        })
        .then((data) => {
            setUser(data);
            console.log(data)
            // navigate("/recipes");
        })
        .catch((e) => {
            alert('incorrect email or password')
            console.log(e);
        });
  }

  function logout() {
    fetch(`https://broadwaycommunity-backend.vercel.app/api/logout`, { method: "DELETE" }).then((res) => {
        if (res.ok) {
            setUser(null);
        }
    });
  }

  return (
    <>
    <main className='main'>
      <Outlet context={{ user, attemptLogin, logout }} />
      <Analytics /> 
    </main>
    </>
  )
}

export default App
