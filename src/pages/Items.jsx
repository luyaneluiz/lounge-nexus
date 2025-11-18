import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";

import CardItem from "../components/CardItem";

import { db } from "../../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function Items() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const produtosRef = collection(db, "items");
        const q = query(produtosRef, orderBy("price", "asc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const itemsList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setItems(itemsList);
                setLoading(false);
            },
            (error) => {
                console.error("Error while fetching items:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Items
            </Typography>

            <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                        <CardItem item={item} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
