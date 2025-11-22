import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import Home from "./pages/Home";
import RegisterSale from "./pages/RegisterSale";
import Items from "./pages/Items";
import Auth from "./pages/Auth";
import Sales from "./pages/Sales";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                ),
            },
            {
                path: "register-sale",
                element: (
                    <PrivateRoute>
                        <RegisterSale />
                    </PrivateRoute>
                ),
            },
            {
                path: "sales",
                element: (
                    <PrivateRoute>
                        <Sales />
                    </PrivateRoute>
                ),
            },
            {
                path: "items",
                element: (
                    <PrivateRoute>
                        <Items />
                    </PrivateRoute>
                ),
            },
            { path: "auth", element: <Auth /> },
        ],
    },
]);

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}
