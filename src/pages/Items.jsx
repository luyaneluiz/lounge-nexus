import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";

import CardItem from "../components/CardItem";

import { db } from "../../firebaseConfig";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    doc,
    updateDoc,
} from "firebase/firestore";

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
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Items
            </Typography>

            <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <CardItem
                            item={item}
                            onUpdate={async (key, updatedItem) => {
                                // Atualização otimista: atualiza UI imediatamente
                                setItems((prev) =>
                                    prev.map((it) =>
                                        it.id === key
                                            ? { ...it, ...updatedItem }
                                            : it
                                    )
                                );

                                try {
                                    const itemRef = doc(db, "items", key);
                                    await updateDoc(itemRef, {
                                        price: Number(updatedItem.price),
                                        credit: Number(updatedItem.credit),
                                    });
                                } catch (err) {
                                    console.error(
                                        "Erro ao atualizar item:",
                                        err
                                    );
                                    // Em caso de erro, opcional: re-carregar lista ou reverter alteração
                                }
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
