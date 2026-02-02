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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
