import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#005a9c'
    },
    secondary: {
      main: '#2f7d32'
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif'
  },
  shape: {
    borderRadius: 12
  }
});
