import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout";
import Home from "./pages/Home";
import RegisterSale from "./pages/RegisterSale";
import Items from "./pages/Items";
import Auth from "./pages/Auth";
import Sales from "./pages/Sales";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "register-sale", element: <RegisterSale /> },
            { path: "sales", element: <Sales /> },
            { path: "items", element: <Items /> },
            { path: "auth", element: <Auth /> },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
