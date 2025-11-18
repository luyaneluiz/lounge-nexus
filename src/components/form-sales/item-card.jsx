import React, { memo } from "react";
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Box,
    IconButton,
    Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const ItemCard = memo(({ item, quantity, onChange }) => {
    const isSelected = quantity > 0;

    const handleAdd = (e) => {
        e.stopPropagation();
        onChange(item.id, 1);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onChange(item.id, -1);
    };

    const handleCardClick = () => {
        onChange(item.id, 1);
    };

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} spacing={1}>
            <Card
                sx={{
                    border: isSelected
                        ? "2px solid #1976d2"
                        : "1px solid #e0e0e0",
                    transition: "transform 0.1s",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardActionArea
                    onClick={handleCardClick}
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                    }}
                >
                    <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt={item.nome}
                        onError={(e) => {
                            e.target.src =
                                "https://placehold.co/600x400?text=Sem+Imagem";
                        }}
                        loading="lazy"
                    />
                    <CardContent sx={{ pb: 0, flexGrow: 1 }}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            noWrap
                        >
                            {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            € {item.price.toFixed(2)} un.
                        </Typography>
                    </CardContent>
                </CardActionArea>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        bgcolor: isSelected ? "#e3f2fd" : "transparent",
                        mt: "auto",
                    }}
                >
                    {isSelected ? (
                        <>
                            <IconButton
                                size="medium"
                                onClick={handleRemove}
                                color="error"
                            >
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                            <Typography fontWeight="bold" variant="h6">
                                {quantity}
                            </Typography>
                            <IconButton
                                size="medium"
                                onClick={handleAdd}
                                color="primary"
                            >
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Typography
                            variant="caption"
                            sx={{
                                ml: 1,
                                color: "text.disabled",
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            Click to add
                        </Typography>
                    )}
                </Box>
            </Card>
        </Grid>
    );
});

export default ItemCard;
