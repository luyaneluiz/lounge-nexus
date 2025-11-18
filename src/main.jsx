import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#20243B',
    },
    secondary: {
      main: '#867650',
    },
    background: {
      default: '#f4f6f8',
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)