import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#20243B",
            light: "#3A4066",
            dark: "#151726",
        },
        secondary: {
            main: "#867650",
            light: "#B09B6B",
            dark: "#594E35",
        },
        background: {
            default: "#f4f6f8",
            paper: "#ffffff",
        },
        charts: [
            "#20243B", // Primary Main
            "#867650", // Secondary Main
            "#3A4066", // Primary Light
            "#B09B6B", // Secondary Light
            "#151726", // Primary Dark
            "#594E35", // Secondary Dark
            "#6E7599", // Slate Blue
            "#D1C4A9", // Beige/Champagne
        ],
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h4: {
            color: "#20243B",
            fontSize: "2rem",
            fontWeight: "bold",
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
