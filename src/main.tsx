import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./Home";
import FeedbackPage from "./pages/FeedbackPage";
import GiveFeedbackPage from "./pages/GiveFeedbackPage";

import AdminPage from "./pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/FeedbackPage",
    element: <FeedbackPage />,
  },
  {
    path: "/GiveFeedbackPage",
    element: <GiveFeedbackPage />,
  },
  {
    path: "/AdminPage",
    element: <AdminPage />,
  },
]);

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
