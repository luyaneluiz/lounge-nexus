import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box,
    Button,
    Typography,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Paper,
    CircularProgress,
    Alert,
    Divider,
    Chip,
} from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";

import { db } from "../../../firebaseConfig";
import { collection, addDoc, Timestamp, onSnapshot } from "firebase/firestore";
import ItemCard from "./item-card";

function FormVendas() {
    const [item, setItems] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [metodo, setMetodo] = useState("Cartão");

    const [loading, setLoading] = useState(false);
    const [loadingProdutos, setLoadingProdutos] = useState(true);
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(lista);
            setLoadingProdutos(false);
        });
        return () => unsubscribe();
    }, []);

    const handleQuantidadeChange = useCallback((id, delta) => {
        setQuantities((prev) => {
            const qtdAtual = prev[id] || 0;
            const novaQtd = Math.max(0, qtdAtual + delta);

            const novoEstado = { ...prev, [id]: novaQtd };
            if (novaQtd === 0) delete novoEstado[id];

            return novoEstado;
        });
    }, []);

    const { totalToPay, totalItems, totalCredit } = useMemo(() => {
        let total = 0;
        let credit = 0;
        let itens = 0;

        item.forEach((p) => {
            const qtd = quantities[p.id] || 0;
            if (qtd > 0) {
                total += p.price * qtd;
                credit += p.credit * qtd;
                itens += qtd;
            }
        });

        return { totalToPay: total, totalItems: itens, totalCredit: credit };
    }, [quantities, item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: "", message: "" });

        if (totalToPay <= 0) {
            setFeedback({
                type: "error",
                message: "Select at least one item.",
            });
            setLoading(false);
            return;
        }

        const soldItems = item
            .filter((p) => quantities[p.id] > 0)
            .map((p) => ({
                id: p.id,
                name: p.name,
                quantities: quantities[p.id],
                price: p.price,
                total: p.price * quantities[p.id],
            }));

        try {
            await addDoc(collection(db, "vendas-loungenexus"), {
                items: soldItems,
                summary: soldItems
                    .map((i) => `${i.quantities}x ${i.name}`)
                    .join(", "),
                total: totalToPay,
                paymentMethod: metodo,
                date: Timestamp.now(),
            });

            setFeedback({
                type: "success",
                message: `Sale of € ${totalToPay} registered!`,
            });
            setQuantities({});
            setMetodo("Card");
        } catch (e) {
            console.error("Error:", e);
            setFeedback({ type: "error", message: "Error registering sale." });
        }
        setLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 3,
                    marginY: 4,
                    borderRadius: "16px 16px 0 0",
                    bgcolor: "white",
                    zIndex: 10,
                }}
            >
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    color="blue"
                    pb={2}
                >
                    Items
                </Typography>

                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                    {loadingProdutos ? (
                        <CircularProgress
                            sx={{ display: "block", margin: "50px auto" }}
                        />
                    ) : (
                        <Grid container spacing={2}>
                            {item.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    quantity={quantities[item.id] || 0}
                                    onChange={handleQuantidadeChange}
                                />
                            ))}
                        </Grid>
                    )}

                    <Box sx={{ height: 20 }} />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="right"
                    mt={2}
                >
                    Total Items: {totalItems}
                </Typography>
            </Paper>

            <Paper
                elevation={10}
                sx={{
                    p: 3,
                    borderRadius: "16px 16px 0 0",
                    bgcolor: "white",
                    zIndex: 10,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        color="blue"
                    >
                        Total
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Please kindly inform our guest about the total amount to
                        be paid and credit for food and drinks.
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Total to pay:
                        </Typography>

                        <Typography
                            variant="h3"
                            color="primary.main"
                            fontWeight="bold"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <EuroIcon sx={{ fontSize: 40, mr: 1 }} />
                            {totalToPay}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            Credit for food & drinks:
                        </Typography>

                        <Typography
                            variant="h3"
                            color="primary.main"
                            fontWeight="bold"
                            sx={{ display: "flex", alignItems: "center" }}
                        >
                            <EuroIcon sx={{ fontSize: 40, mr: 1 }} />
                            {totalCredit}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={10}
                sx={{
                    p: 3,
                    borderRadius: "16px 16px 0 0",
                    bgcolor: "white",
                    zIndex: 10,
                }}
            >
                {feedback.message && (
                    <Alert
                        severity={feedback.type}
                        sx={{ mb: 2 }}
                        onClose={() => setFeedback({ type: "", message: "" })}
                    >
                        {feedback.message}
                    </Alert>
                )}

                <Grid item xs={12} md={7}>
                    <FormControl fullWidth>
                        <FormLabel id="metodo-label" sx={{ mb: 1 }}>
                            Payment Method
                        </FormLabel>

                        <RadioGroup
                            aria-labelledby="metodo-label"
                            name="payment-method"
                            value={metodo}
                            onChange={(e) => setMetodo(e.target.value)}
                        >
                            <FormControlLabel
                                value="Card"
                                control={<Radio />}
                                label={
                                    <Box
                                        sx={{
                                            border: "1px solid #ccc",
                                            borderRadius: 1,
                                            px: 2,
                                            py: 0.5,
                                        }}
                                    >
                                        Card
                                    </Box>
                                }
                                sx={{ m: 0 }}
                            />
                            <FormControlLabel
                                value="Cash"
                                control={<Radio />}
                                label={
                                    <Box
                                        sx={{
                                            border: "1px solid #ccc",
                                            borderRadius: 1,
                                            px: 2,
                                            py: 0.5,
                                        }}
                                    >
                                        Cash
                                    </Box>
                                }
                                sx={{ m: 0 }}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || totalToPay === 0}
                    sx={{
                        py: 2,
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 2,
                    }}
                >
                    {loading ? (
                        <CircularProgress size={28} color="inherit" />
                    ) : (
                        `Register sale`
                    )}
                </Button>
            </Paper>
        </form>
    );
}

export default FormVendas;
