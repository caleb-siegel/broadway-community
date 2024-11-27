import React, { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useNavigate } from "react-router-dom";
import Header from "./header/Header";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // const backendUrl = "https://broadwaycommunity-backend.vercel.app"
  const backendUrl = "http://127.0.0.1:5000"


  useEffect(() => {
    fetch(`${backendUrl}/api/check_session`, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Session check failed");
      })
      .then((user) => setUser(user))
      .catch((error) => {
        console.error("Session check error:", error);
        setUser(null);
      });
  }, []);

  function attemptLogin(userInfo) {
    fetch(`${backendUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      credentials: "include",
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
        console.log(data);
        navigate("/preferences");
      })
      .catch((e) => {
        alert("incorrect email or password");
        console.log(e);
      });
  }

  function logout() {
    fetch(`${backendUrl}/api/logout`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setUser(null);
      }
    });
  }

  return (
    <>
      <main className="main">
        <Header logout={logout} user={user} />
        <Outlet context={{ user, attemptLogin, logout, backendUrl }} />
        <Analytics />
      </main>
    </>
  );
}

export default App;
