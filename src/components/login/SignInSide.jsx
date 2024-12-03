import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import getSignInSideTheme from "./theme/getSignInSideTheme";
import SignInCard from "./SignInCard";
import Content from "./Content";

export default function SignInSide() {
  const [mode, setMode] = useState("light");
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const SignInSideTheme = createTheme(getSignInSideTheme(mode));
  // This code only runs on the client side, to determine the system color preference
  // React.useEffect(() => {
  //   // Check if there is a preferred mode in localStorage
  //   const savedMode = localStorage.getItem("themeMode");
  //   if (savedMode) {
  //     setMode(savedMode);
  //   } else {
  //     // If no preference is found, it uses system preference
  //     const systemPrefersDark = window.matchMedia(
  //       "(prefers-color-scheme: dark)"
  //     ).matches;
  //     setMode(systemPrefersDark ? "dark" : "light");
  //   }
  // }, []);

  return (
    <ThemeProvider theme={showCustomTheme ? SignInSideTheme : defaultTheme}>
      {/* <CssBaseline enableColorScheme /> */}
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: "space-between",
            height: { xs: "auto", md: "100%" },
          },
          // (theme) => ({
          //   backgroundImage:
          //     "radial-gradient(ellipse at 70% 51%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
          //   backgroundSize: "cover",
          //   ...theme.applyStyles("dark", {
          //     backgroundImage:
          //       "radial-gradient(at 70% 51%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
          //   }),
          // }),
        ]}
      >
        <Stack
          sx={{
            display: "flex", // Enable flexbox layout
            flexDirection: "column", // Stack children vertically
            justifyContent: "center", // Vertically center content
            alignItems: "center", // Horizontally center content
            height: "100vh", // Take full viewport height
            p: { xs: 2, sm: 4 }, // Padding
            m: "auto", // Ensure it stays centered
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "center",
              gap: { xs: 2, sm: 4 }, // Reduced gap
              p: { xs: 2, sm: 4 },
              width: "100%", // Full width
              maxWidth: 400, // Limit maximum width
            }}
          >
            {/* <Content /> */}
            <SignInCard
              sx={{ 
                width: '100%', 
                maxWidth: 350, // Make card thinner
              }} 
      />
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
