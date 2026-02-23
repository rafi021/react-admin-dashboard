import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import UsersIndex from "./pages/users/Index.tsx";
// import { Toaster } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/users",
        element: <UsersIndex />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          title: "font-bold text-white",
          description: "text-sm text-white",
        },
        style: {
          background: "#c96442",
        },
      }}
    />
  </StrictMode>,
);
