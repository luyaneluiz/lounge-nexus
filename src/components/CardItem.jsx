import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function CardItem({ item, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [price, setPrice] = useState(item.price ?? "");
    const [credit, setCredit] = useState(item.credit ?? "");

    function handleSave() {
        const updated = {
            ...item,
            price: Number(price),
            credit: Number(credit),
        };
        if (onUpdate) {
            // prefer id if available, otherwise fallback to _id or name
            const key = item.id ?? item._id ?? item.name;
            onUpdate(key, updated);
        } else {
            // fallback: just log if parent didn't provide an updater
            console.log("onUpdate not provided — updated item:", updated);
        }
        setEditing(false);
    }

    function handleCancel() {
        setPrice(item.price ?? "");
        setCredit(item.credit ?? "");
        setEditing(false);
    }

    return (
        <Card sx={{ maxWidth: 345 }} border={1} borderColor="secondary.main">
            <CardActionArea>
                <CardMedia component="img" height="300" image={item.image} />

                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ color: "secondary.main" }}
                    >
                        {item.name}
                    </Typography>

                    {editing ? (
                        <Box display="flex" flexDirection="column" gap={1}>
                            <TextField
                                label="Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                size="small"
                            />
                            <TextField
                                label="Credit"
                                value={credit}
                                onChange={(e) => setCredit(e.target.value)}
                                type="number"
                                size="small"
                            />
                            <Box display="flex" gap={1} mt={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                pb={1}
                            >
                                <b>Price:</b> € {item.price} | <b>Credit:</b> €{" "}
                                {item.credit}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                {item.description}
                            </Typography>

                            <Box mt={1}>
                                <Button
                                    size="small"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
