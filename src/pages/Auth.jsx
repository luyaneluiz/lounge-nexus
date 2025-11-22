import React, { useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/"); // Redireciona para o Dashboard após sucesso
        } catch (err) {
            console.error(err);
            setError("Failed to log in. Please check your credentials.");
        }

        setLoading(false);
    }

    return (
        <Box
            sx={{
                height: "calc(100vh - 160px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    p: 4,
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                    borderRadius: 4,
                    bgcolor: "background.paper",
                }}
            >
                {/* Ícone de Cadeado Dourado */}
                <Box
                    sx={{
                        bgcolor: "secondary.main",
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        mb: 2,
                        color: "white",
                    }}
                >
                    <LockOutlinedIcon />
                </Box>

                <Typography
                    variant="h5"
                    component="h1"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                >
                    LoungeNexus
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Sign in to access the management dashboard
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email Address"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            fontWeight: "bold",
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.light" },
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "SIGN IN"
                        )}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
