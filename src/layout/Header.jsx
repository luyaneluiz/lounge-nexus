import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

// Ícones
import HomeIcon from "@mui/icons-material/Home";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function Header({ isActive }) {
    return (
        <AppBar position="static" color="primary" enableColorOnDark>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
                >
                    LoungeNexus
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/"
                        startIcon={<HomeIcon />}
                        sx={{
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
                        startIcon={<PointOfSaleIcon />}
                        sx={{
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
                        startIcon={<InventoryIcon />}
                        sx={{
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
