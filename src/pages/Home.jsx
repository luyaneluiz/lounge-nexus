import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    useTheme,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { db } from "../../firebaseConfig";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where,
    Timestamp,
} from "firebase/firestore";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function Home() {
    const theme = useTheme();

    const [monthSales, setMonthSales] = useState([]);
    const [yearSales, setYearSales] = useState([]);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    useEffect(() => {
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(
            selectedYear,
            selectedMonth + 1,
            0,
            23,
            59,
            59
        );

        const q = query(
            collection(db, "vendas-loungenexus"),
            where("date", ">=", Timestamp.fromDate(startDate)),
            where("date", "<=", Timestamp.fromDate(endDate)),
            orderBy("date", "asc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const salesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    dateObj: doc.data().date
                        ? doc.data().date.toDate()
                        : new Date(),
                }));
                setMonthSales(salesData);
            },
            (error) => {
                console.error("Error fetching month sales data:", error);
            }
        );

        return () => unsubscribe();
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        const startOfYear = new Date(selectedYear, 0, 1);
        const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59);

        const q = query(
            collection(db, "vendas-loungenexus"),
            where("date", ">=", Timestamp.fromDate(startOfYear)),
            where("date", "<=", Timestamp.fromDate(endOfYear)),
            orderBy("date", "asc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const salesData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    dateObj: doc.data().date
                        ? doc.data().date.toDate()
                        : new Date(),
                }));
                setYearSales(salesData);
            },
            (error) => {
                console.error("Error fetching year sales data:", error);
            }
        );

        return () => unsubscribe();
    }, [selectedYear]);

    const kpiData = useMemo(() => {
        const totalRevenue = monthSales.reduce(
            (acc, curr) => acc + (curr.total || 0),
            0
        );
        const totalOrders = monthSales.length;
        const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        return { totalRevenue, totalOrders, avgTicket };
    }, [monthSales]);

    const barChartData = useMemo(() => {
        const salesByDate = {};

        monthSales.forEach((sale) => {
            const dateKey = sale.dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
            });
            salesByDate[dateKey] = (salesByDate[dateKey] || 0) + sale.total;
        });

        return {
            labels: Object.keys(salesByDate),
            datasets: [
                {
                    label: "Daily Revenue (€)",
                    data: Object.values(salesByDate),
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 4,
                },
            ],
        };
    }, [monthSales, theme]);

    const doughnutChartData = useMemo(() => {
        const itemsCount = {};

        monthSales.forEach((sale) => {
            if (sale.items && Array.isArray(sale.items)) {
                sale.items.forEach((item) => {
                    itemsCount[item.name] =
                        (itemsCount[item.name] || 0) + item.quantities;
                });
            } else {
                const name = sale.item || "Unknown";
                itemsCount[name] = (itemsCount[name] || 0) + 1;
            }
        });

        return {
            labels: Object.keys(itemsCount),
            datasets: [
                {
                    label: "# of Items Sold",
                    data: Object.values(itemsCount),
                    backgroundColor: [
                        "#1976d2",
                        "#dc004e",
                        "#388e3c",
                        "#fbc02d",
                        "#8e24aa",
                        "#424242",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [monthSales]);

    const paymentChartData = useMemo(() => {
        const paymentTotals = {};
        monthSales.forEach((sale) => {
            const method = sale.paymentMethod || "Unknown";
            paymentTotals[method] = (paymentTotals[method] || 0) + sale.total;
        });

        return {
            labels: Object.keys(paymentTotals),
            datasets: [
                {
                    label: "Revenue (€)",
                    data: Object.values(paymentTotals),
                    backgroundColor: [
                        "#2e7d32", // Verde (Cash/Dinheiro)
                        "#0288d1", // Azul (Card/Cartão)
                        "#ed6c02", // Laranja (Room Charge)
                        "#9c27b0", // Roxo (Outro)
                    ],
                    borderColor: "#ffffff",
                    borderWidth: 2,
                },
            ],
        };
    }, [monthSales]);

    const monthlyBarChartData = useMemo(() => {
        const salesByMonth = Array(12).fill(0);
        yearSales.forEach((sale) => {
            const monthIndex = sale.dateObj.getMonth();
            salesByMonth[monthIndex] += sale.total;
        });
        return {
            labels: monthNames.map((m) => m.substring(0, 3)),
            datasets: [
                {
                    label: `Monthly Revenue (${selectedYear} - €)`,
                    data: salesByMonth,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 4,
                },
            ],
        };
    }, [yearSales, selectedYear, theme]);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Sales Dashboard
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Overview for {monthNames[selectedMonth]} {selectedYear}
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl
                        sx={{ bgcolor: "background.paper", minWidth: 140 }}
                    >
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={selectedMonth}
                            label="Month"
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {monthNames.map((name, index) => (
                                <MenuItem key={index} value={index}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl
                        sx={{ bgcolor: "background.paper", minWidth: 100 }}
                    >
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            label="Year"
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {Array.from(
                                { length: 5 },
                                (_, i) => new Date().getFullYear() - i
                            ).map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    color="primary"
                    component={Link}
                    to="/register-sale"
                    startIcon={<PointOfSaleIcon />}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    Register Sale
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <KpiCard
                        title="Total Revenue"
                        value={`€ ${kpiData.totalRevenue.toFixed(2)}`}
                        icon={<AttachMoneyIcon fontSize="large" />}
                        color="#388e3c"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <KpiCard
                        title="Total Orders"
                        value={kpiData.totalOrders}
                        icon={<ShoppingBagIcon fontSize="large" />}
                        color="#1976d2"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <KpiCard
                        title="Avg. Ticket"
                        value={`€ ${kpiData.avgTicket.toFixed(2)}`}
                        icon={<TrendingUpIcon fontSize="large" />}
                        color="#f57c00"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={3}
                        sx={{ p: 3, borderRadius: 2, height: "400px" }}
                    >
                        <Typography variant="h6" gutterBottom align="center">
                            Payment Methods (Revenue)
                        </Typography>

                        <Box
                            sx={{
                                height: "320px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Pie
                                data={paymentChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: "bottom" } },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper
                        elevation={3}
                        sx={{ p: 3, borderRadius: 2, height: "400px" }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Top Items ({monthNames[selectedMonth]})
                        </Typography>
                        <Box
                            sx={{
                                height: "320px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Doughnut
                                data={doughnutChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: "bottom" },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Paper
                        elevation={3}
                        sx={{ p: 3, borderRadius: 2, height: "400px" }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Daily Revenue ({monthNames[selectedMonth]})
                        </Typography>
                        <Box sx={{ height: "320px", width: "100%" }}>
                            <Bar
                                data={barChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: "top" },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Paper
                        elevation={3}
                        sx={{ p: 3, borderRadius: 2, height: "400px" }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Annual Performance ({selectedYear})
                        </Typography>
                        <Box sx={{ height: "320px", width: "100%" }}>
                            <Bar
                                data={monthlyBarChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: "top" },
                                    },
                                }}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

function KpiCard({ title, value, icon, color }) {
    return (
        <Card elevation={3} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Typography
                        color="text.secondary"
                        gutterBottom
                        variant="overline"
                        fontSize={14}
                    >
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        bgcolor: `${color}20`,
                        color: color,
                        p: 1.5,
                        borderRadius: "50%",
                        display: "flex",
                    }}
                >
                    {icon}
                </Box>
            </CardContent>
        </Card>
    );
}
