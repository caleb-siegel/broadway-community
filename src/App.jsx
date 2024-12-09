import React, { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useNavigate } from "react-router-dom";
import Header from "./header/Header";
import LoadingSpinner from "./Loading";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // const backendUrl = "https://broadwaycommunity-backend.vercel.app"
  const backendUrl = "http://127.0.0.1:5000"


  useEffect(() => {
    // Function to check session
    const checkSession = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/check_session`, {
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
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
        console.log(("User info:", data))
        // user && console.log("User info:", user);
        // user && navigate("/preferences");
        navigate("/");
      })
      .catch((e) => {
        alert("incorrect email or password");
        console.log(e);
      });
  }

  // useEffect(() => {
  //   if (user) {
  //     console.log("User info after login:", user);
  //     // navigate("/preferences");
  //   }
  // }, [user]);

  function logout() {
    fetch(`${backendUrl}/api/logout`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        console.log("deleted")
        setUser(null);
      }
    });
  }

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
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
