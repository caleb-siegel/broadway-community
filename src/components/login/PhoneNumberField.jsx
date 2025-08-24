import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// This wrapper lets us use MUI styling with react-phone-number-input
export default function PhoneNumberField({ value, onChange, error, helperText }) {
  const [displayValue, setDisplayValue] = useState("");

  const handleChange = (val) => {
    if (!val) {
      setDisplayValue("");
      onChange("");
      return;
    }

    // Parse the phone number to format it
    const phoneNumber = parsePhoneNumberFromString(val);
    if (phoneNumber) {
      // Format display as (XXX) XXX-XXXX for US
      if (phoneNumber.country === "US") {
        const national = phoneNumber.formatNational(); // → (551) 486-7067
        setDisplayValue(national);
      } else {
        setDisplayValue(phoneNumber.formatInternational());
      }

      // Store in E.164 format
      onChange(phoneNumber.number); // → +15514867067
    } else {
      setDisplayValue(val);
      onChange(val);
    }
  };

  return (
    <PhoneInput
      defaultCountry="US"
      value={value}
      onChange={handleChange}
      international={false}
      countryCallingCodeEditable={false}
      inputComponent={React.forwardRef((props, ref) => (
        <TextField
          {...props}
          inputRef={ref}
          fullWidth
          label="Phone number*"
          value={displayValue}
          error={error}
          helperText={helperText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {/* react-phone-number-input injects the flag here automatically */}
              </InputAdornment>
            ),
          }}
        />
      ))}
    />
  );
}