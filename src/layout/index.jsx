import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Header from "./Header.jsx";

function Layout() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Header isActive={isActive} />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                <Outlet />
            </Container>
        </Box>
    );
}

export default Layout;
