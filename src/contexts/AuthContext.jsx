import React, { createContext, useContext, useState, useEffect } from "react";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

const AuthContext = createContext();

// Hook para usar o auth em qualquer lugar
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função de Login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Função de Logout
    function logout() {
        return signOut(auth);
    }

    // Monitorar estado (Logado/Deslogado)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
