import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Home from "./components/Home.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeList from "./components/EmployeeList.tsx";
import EmployeeDetail from "./components/EmployeeDetail.tsx";
import CreateEmployee from "./components/CreateEmployee.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.tsx";
import AdminUsersPage from "./components/admin/AdminUsersPage.tsx";
import { AdminRoute } from "./routes/AdminRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // 🔓 Public routes
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },

      // 🔒 Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/employee-list",
            element: <EmployeeList />,
          },
          {
            path: "/employee/:id",
            element: <EmployeeDetail />,
          },
          {
            path: "/create-employee",
            element: <CreateEmployee />,
          },

          // 🔐 Admin-only routes
          {
            element: <AdminRoute />,
            children: [{ path: "/admin/users", element: <AdminUsersPage /> }],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
