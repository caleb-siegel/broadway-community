import React, { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { useNavigate } from "react-router-dom";
import Header from "./header/Header";
import LoadingSpinner from "./Loading";
import { useGoogleLogin } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const backendUrl = "https://broadwaycommunity-backend.vercel.app"
  // const backendUrl = "http://127.0.0.1:5000"

  useEffect(() => {
    if (user) {
      navigate("/alerts");
    }
  }, [user, navigate]); // Runs when `user` changes


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
        navigate("/alerts");
      })
      .catch((e) => {
        alert("incorrect email or password");
        console.log(e);
      });
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
        console.log('Login successful:', data);
        
        // Handle successful login (e.g., redirect or update UI)
        setUser(data.user, () => {
          navigate("/alerts");
        });

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
        <Outlet context={{ user, attemptLogin, logout, backendUrl, googleLogin }} />
        <Analytics />
      </main>
    </>
  );
}

export default App;
