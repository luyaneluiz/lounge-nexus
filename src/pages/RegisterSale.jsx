import React from "react";
import { Box, Typography } from "@mui/material";
import FormSales from "../components/form-sales/form";

export default function RegisterSale() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Register Sale
            </Typography>

            <Typography>Use the form below to register a new sale.</Typography>

            <FormSales />
        </Box>
    );
}
