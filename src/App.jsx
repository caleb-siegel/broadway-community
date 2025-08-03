import React, { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useNavigate } from "react-router-dom";
import Header from "./header/Header";
import LoadingSpinner from "./Loading";
import { useGoogleLogin } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const backendUrl = "https://broadwaycommunity-backend.vercel.app"
  // const backendUrl = "http://127.0.0.1:5000"

  // useEffect(() => {
  //   if (user) {
  //     navigate("/alerts");
  //   }
  // }, [user, navigate]); // Runs when `user` changes


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
  
      // Optional: confirm validity with server
      // fetch(`${backendUrl}/api/check_session`, {
      //   credentials: "include",
      // })
      //   .then(res => res.ok ? res.json() : Promise.reject())
      //   .then(validUser => setUser(validUser))
      //   .catch(() => {
      //     localStorage.removeItem("user");
      //     setUser(null);
      //   });
    }
  }, []);

  async function attemptLogin(userInfo) {
    try {
      const res = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userInfo),
      });
      if (!res.ok) throw res;
      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/alerts");
    } catch (e) {
      alert("Incorrect email or password");
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Get user info from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            'Authorization': `Bearer ${codeResponse.access_token}`,
          },
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to get user info from Google');
        }
        
        const userInfo = await userResponse.json();
        
        // Send to your backend
        const backendResponse = await fetch(`${backendUrl}/api/auth/google`, {
          method: 'POST',
          credentials: 'include',  // Important for cookies
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${codeResponse.access_token}`,
          },
          body: JSON.stringify({ userInfo })
        });
        
        if (!backendResponse.ok) {
          throw new Error('Backend authentication failed');
        }
  
        const data = await backendResponse.json();
        
        // Handle successful login (e.g., redirect or update UI)
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/alerts");

      } catch (error) {
        console.error('Error during login:', error);
        // Handle error (e.g., show error message to user)
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
    },
    flow: 'implicit',
    scope: 'email profile',
  });

  function logout() {
    fetch(`${backendUrl}/api/logout`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        localStorage.removeItem("user");
        setUser(null);
      }
    });
  }

  // if (isLoading) {
  //   return (
  //     <LoadingSpinner />
  //   );
  // }

  return (
    <>
      <main className="main">
        <Header logout={logout} user={user} />
        <Outlet context={{ user, attemptLogin, logout, backendUrl, googleLogin }} />
        <Analytics />
        <ToastContainer position="top-right" autoClose={4000} />
      </main>
    </>
  );
}

export default App;
