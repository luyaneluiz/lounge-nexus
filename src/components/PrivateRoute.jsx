import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    // Se não tem usuário logado, redireciona para a rota de autenticação
    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    // Se tem usuário, mostra o conteúdo (children)
    return children;
}
