import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
// import AppTheme from '../shared-theme/AppTheme';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./CustomIcons";
// import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { useOutletContext } from "react-router-dom";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

// const SignUpContainer = styled(Stack)(({ theme }) => ({
//   height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
//   minHeight: '100%',
//   padding: theme.spacing(2),
//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(4),
//   },
//   '&::before': {
//     content: '""',
//     display: 'block',
//     position: 'absolute',
//     zIndex: -1,
//     inset: 0,
//     backgroundImage:
//       'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//     backgroundRepeat: 'no-repeat',
//     ...theme.applyStyles('dark', {
//       backgroundImage:
//         'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
//     }),
//   },
// }));

export default function SignUp(props) {
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const { attemptLogin } = useOutletContext();
  const [smsConsent, setSmsConsent] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  // Update validateInputs to require phone
  const validateInputs = () => {
    let isValid = true;

    // Email validation
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Phone number validation (simple digits check)
    if (!newNumber || !/^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/.test(newNumber)) {
      setPhoneError(true);
      setPhoneErrorMessage("Please enter a valid phone number.");
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    // Password validation
    if (!newPassword || newPassword.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    // Confirm password validation
    if (newPassword !== newConfirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    // Name validations
    if (!newFirstName || newFirstName.length < 1) {
      setNameError(true);
      setNameErrorMessage("First name is required.");
      isValid = false;
    }

    if (!newLastName || newLastName.length < 1) {
      setNameError(true);
      setNameErrorMessage("Last name is required.");
      isValid = false;
    }

    return isValid;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (validateInputs()) {
      const userData = {
        email: newEmail,
        password_hash: newPassword,
        first_name: newFirstName,
        last_name: newLastName,
        phone_number: newNumber,
        sms_consent: smsConsent, // include SMS consent
      };
      fetch("https://broadwaycommunity-backend.vercel.app/api/user", {
        method: "POST",
        headers: { "Content-Type": "Application/JSON" },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((newUser) => {
          setNewEmail("");
          setNewPassword("");
          setNewConfirmPassword("");
          setNewFirstName("");
          setNewLastName("");
          setNewNumber("");
          setSmsConsent(true);
          attemptLogin({ email: newEmail, password: newPassword });
        });
    }
  }

  return (
    <Box
     sx={{
       display: "flex",
       flexDirection: "column",
       justifyContent: "center",
       alignItems: "center",
     }}
   >
     <Card
       variant="outlined"
       sx={{ 
         width: { xs: "90%", sm: "400px" }, 
         marginTop: "75px",
         p: 3,
         borderRadius: "12px", // Set your desired border radius here
       }}
     >
       <Typography
         component="h1"
         variant="h4"
         sx={{ 
           width: "100%", 
           fontSize: "clamp(1.5rem, 10vw, 2rem)", 
           textAlign: "center",
           mb: 2 
         }}
       >
         Sign up
       </Typography>
       <Box
         component="form"
         onSubmit={handleSubmit}
         sx={{ display: "flex", flexDirection: "column", gap: 2 }}
       >
         <TextField
           label="First name*"
           fullWidth
           placeholder="Alexander"
           value={newFirstName}
           onChange={(e) => setNewFirstName(e.target.value)}
           error={nameError}
           helperText={nameErrorMessage}
         />
         <TextField
           label="Last name*"
           fullWidth
           placeholder="Hamilton"
           value={newLastName}
           onChange={(e) => setNewLastName(e.target.value)}
           error={nameError}
           helperText={nameErrorMessage}
         />
         <TextField
           label="Email*"
           fullWidth
           placeholder="alexander.hamilton@gmail.com"
           value={newEmail}
           onChange={(e) => setNewEmail(e.target.value)}
           error={emailError}
           helperText={emailErrorMessage}
         />
         <TextField
           label="Phone number*"
           fullWidth
           placeholder="(123) 456-7890"
           value={newNumber}
           onChange={(e) => setNewNumber(e.target.value)}
           error={phoneError}
           helperText={phoneErrorMessage}
         />
         <TextField
           label="Password*"
           type={showPassword ? "text" : "password"}
           fullWidth
           value={newPassword}
           onChange={(e) => setNewPassword(e.target.value)}
           error={passwordError}
           helperText={passwordErrorMessage}
           InputProps={{
             endAdornment: (
               <InputAdornment position="end">
                 <IconButton onClick={() => setShowPassword(!showPassword)}>
                   {showPassword ? <VisibilityOff /> : <Visibility />}
                 </IconButton>
               </InputAdornment>
             ),
           }}
         />
         <TextField
           label="Confirm Password*"
           type={showConfirmPassword ? "text" : "password"}
           fullWidth
           value={newConfirmPassword}
           onChange={(e) => setNewConfirmPassword(e.target.value)}
           error={confirmPasswordError}
           helperText={confirmPasswordErrorMessage}
           InputProps={{
             endAdornment: (
               <InputAdornment position="end">
                 <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                   {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                 </IconButton>
               </InputAdornment>
             ),
           }}
         />
         <FormControlLabel
          control={
            <Checkbox
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              color="primary"
            />
          }
          label="I agree to receive SMS Messages for event deals."
        />
         <Button
           type="submit"
           fullWidth
           variant="contained"
           sx={{ mt: 1 }}
         >
           Sign up
         </Button>
         <Typography sx={{ textAlign: "center", mt: 1 }}>
           Already have an account?{" "}
           <Link href="/login" variant="body2">
             Sign in
           </Link>
         </Typography>
       </Box>
     </Card>
   </Box>
  );
}