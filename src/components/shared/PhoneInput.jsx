import React, { useState, useEffect } from 'react';
import { TextField, FormControl, Select, MenuItem, Box, InputAdornment } from '@mui/material';

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+972', country: 'IL', flag: '🇮🇱' },
];

const PhoneInput = ({ 
  value, 
  onChange, 
  error = false, 
  helperText = "", 
  label = "Phone Number",
  fullWidth = true,
  required = false 
}) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState('');

  useEffect(() => {
    if (value) {
      // Parse existing value to set country code and display
      const codeMatch = value.match(/^\+(\d+)/);
      if (codeMatch) {
        const code = `+${codeMatch[1]}`;
        const country = countryCodes.find(c => c.code === code);
        if (country) {
          setCountryCode(code);
          const phonePart = value.replace(code, '');
          setRawValue(phonePart);
          setDisplayValue(formatPhoneNumber(phonePart));
        }
      }
    }
  }, [value]);

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (countryCode === '+1' && cleaned.length <= 10) {
      if (cleaned.length === 0) return '';
      if (cleaned.length <= 3) return `(${cleaned}`;
      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    
    // For other countries, just add spaces every 3-4 digits
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8, 12)}`;
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, '');
    
    setRawValue(cleaned);
    setDisplayValue(formatPhoneNumber(cleaned));
    
    // Create the raw value to send to backend
    const fullNumber = countryCode + cleaned;
    onChange(fullNumber);
  };

  const handleCountryCodeChange = (e) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    
    // Update the full number with new country code
    const fullNumber = newCode + rawValue;
    onChange(fullNumber);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <Select
          value={countryCode}
          onChange={handleCountryCodeChange}
          sx={{
            borderRadius: '12px',
            fontSize: '0.9rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1,
            },
          }}
        >
          {countryCodes.map((country) => (
            <MenuItem key={country.code} value={country.code} sx={{ fontSize: '0.9rem' }}>
              {country.flag} {country.code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        label={label}
        value={displayValue}
        onChange={handlePhoneChange}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        required={required}
        placeholder={countryCode === '+1' ? '(123) 456-7890' : '1234 5678 9012'}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            fontSize: '0.9rem',
            '& fieldset': {
              borderWidth: 1,
            },
          },
        }}
      />
    </Box>
  );
};

export default PhoneInput;
