import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Routing/router.jsx";
import Aos from "aos";
import 'aos/dist/aos.css';
import AuthProvider from "./Context/AuthContext/AuthProvider.jsx";
Aos.init();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="max-w-7xl mx-auto">
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </div>
  </StrictMode>
);
