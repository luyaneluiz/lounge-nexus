import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Header({ isActive }) {
    return (
        <AppBar
            position="static"
            color="primary"
            sx={{ paddingY: 1 }}
            enableColorOnDark
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
                >
                    LoungeNexus
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        sx={{
                            borderRadius: 0,
                            borderBottom: isActive("/")
                                ? "2px solid white"
                                : "none",
                        }}
                    >
                        Dashboard
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/sales"
                        sx={{
                            borderRadius: 0,
                            borderBottom: isActive("/sales")
                                ? "2px solid white"
                                : "none",
                        }}
                    >
                        Sales
                    </Button>

                    <Button
                        color="inherit"
                        component={Link}
                        to="/items"
                        sx={{
                            borderRadius: 0,
                            borderBottom: isActive("/items")
                                ? "2px solid white"
                                : "none",
                        }}
                    >
                        Items
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
