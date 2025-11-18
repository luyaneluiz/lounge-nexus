import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Tooltip,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

import { db } from "../../firebaseConfig";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where,
    Timestamp,
    deleteDoc,
    doc,
} from "firebase/firestore";

export default function Sales() {
    const [sales, setSales] = useState([]);

    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split("T")[0];
    });

    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split("T")[0];
    });

    const [filterMethod, setFilterMethod] = useState("All");

    useEffect(() => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const q = query(
            collection(db, "vendas-loungenexus"),
            where("date", ">=", Timestamp.fromDate(start)),
            where("date", "<=", Timestamp.fromDate(end)),
            orderBy("date", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const salesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    dateObj: doc.data().data
                        ? doc.data().data.toDate()
                        : new Date(),
                }));
                setSales(salesData);
            },
            (error) => {
                console.error("Error loading sales:", error);
            }
        );

        return () => unsubscribe();
    }, [startDate, endDate]);

    const filteredSales = useMemo(() => {
        if (filterMethod === "All") return sales;
        return sales.filter((s) => s.paymentMethod === filterMethod);
    }, [sales, filterMethod]);

    const currentTotal = useMemo(() => {
        return filteredSales.reduce((acc, curr) => acc + curr.total, 0);
    }, [filteredSales]);

    const handleDelete = async (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this sale record? This cannot be undone."
            )
        ) {
            try {
                await deleteDoc(doc(db, "vendas-loungenexus", id));
            } catch (e) {
                alert("Error deleting document: " + e.message);
            }
        }
    };

    // Helper para cores dos Chips
    const getMethodColor = (method) => {
        switch (method) {
            case "Card":
                return "primary";
            case "Cash":
                return "success";
            default:
                return "default";
        }
    };

    return (
        <Box>
            <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                color="primary"
                sx={{ mb: 3 }}
            >
                Sales History
            </Typography>

            {/* --- BARRA DE FILTROS --- */}
            <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="Start Date"
                            type="date"
                            fullWidth
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            select
                            label="Payment Method"
                            fullWidth
                            value={filterMethod}
                            onChange={(e) => setFilterMethod(e.target.value)}
                        >
                            <MenuItem value="All">All Methods</MenuItem>
                            <MenuItem value="Card">Card</MenuItem>
                            <MenuItem value="Cash">Cash</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Resumo do Total Filtrado */}
                    <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
                        <Typography variant="body2" color="text.secondary">
                            Filtered Total
                        </Typography>
                        <Typography
                            variant="h4"
                            color="primary"
                            fontWeight="bold"
                        >
                            € {currentTotal.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* --- TABELA DE DADOS --- */}
            <TableContainer
                component={Paper}
                elevation={3}
                sx={{ borderRadius: 2 }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: "background.default" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Date / Time
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Items Summary
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Method
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ fontWeight: "bold" }}
                            >
                                Value (€)
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold" }}
                            >
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            // loading ? (
                            //     <TableRow>
                            //         <TableCell
                            //             colSpan={5}
                            //             align="center"
                            //             sx={{ py: 5 }}
                            //         >
                            //             <CircularProgress />
                            //         </TableCell>
                            //     </TableRow>
                            // ) :
                            filteredSales.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 3 }}
                                    >
                                        <Typography color="text.secondary">
                                            No sales found for this period.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredSales.map((sale) => (
                                    <TableRow key={sale.id} hover>
                                        <TableCell>
                                            {sale.dateObj.toLocaleDateString(
                                                "en-GB"
                                            )}
                                            <Typography
                                                variant="caption"
                                                display="block"
                                                color="text.secondary"
                                            >
                                                {sale.dateObj.toLocaleTimeString(
                                                    "en-GB",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {/* Se tiver resumo novo, mostra. Se não, mostra item antigo */}
                                            {sale.summary || sale.item || (
                                                <i>Legacy Data</i>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={sale.paymentMethod}
                                                size="small"
                                                color={getMethodColor(
                                                    sale.paymentMethod
                                                )}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            € {sale.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Delete Sale">
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        handleDelete(sale.id)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
