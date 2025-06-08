import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import useStore from "./hooks/useStore";

import LandingLayout from "./pages/Landing"
import Sections from "./pages/Landing/Sections";
import Login from "./pages/Login/login";
import Register from "./pages/Register/Register";
import ServiceTypes from "./pages/Landing/serviceTypes/serviceTypes";
import ShopCart from "./pages/Landing/ShopCart/ShopCart";
import ShopCart2 from "./pages/Landing/ShopCart/ShopCart2";
import Profile from "./pages/Landing/Profile"

import WorkSpaceLayout from "./pages/WorkSpace";
import AppointmentManagement from "./pages/WorkSpace/AppointmentManagement";
import PersonalManagement from "./pages/WorkSpace/PersonalManagement";
import ServicesManagement from "./pages/WorkSpace/ServicesManagement";
import Analytics from "./pages/WorkSpace/Analytics";

import Error from "./components/LoadAndErr/Error";
import Loader from "./components/LoadAndErr/Loader";
import image from "../public/img/bgDark.webp"

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const validateToken = async () => {
      if (!currentUser || !currentUser.token) {
        setIsAuthenticated(false); 
        return;
      }

      try {
        const decodedToken = jwtDecode(currentUser.token);
        const currentTime = Date.now() / 1000; 

        if (decodedToken.exp < currentTime) {
          console.warn("El JWT ha expirado");
          setIsAuthenticated(false); 
          localStorage.removeItem("currentUser");
          return;
        }
        setIsAuthenticated(true);
      } catch (err) {
        console.error('La verificación de autenticación falló:', err);
        setIsAuthenticated(false);
        localStorage.removeItem("currentUser");
      }
    };

    validateToken();
  }, [currentUser?.token]); 

  // --- Lógica de Renderizado ---
  if (isAuthenticated === null) return <Loader context={{image}} />
  if(isAuthenticated === false) return <Navigate to="/login" replace />;
  if (isAuthenticated) return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        element: <Sections />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/serviceTypes/:id?",
        element: <ServiceTypes />,
      },
      {
        path: "/shopCart",
        element: (
          <ProtectedRoute>
            <ShopCart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/shopCart2",
        element: (
          <ProtectedRoute>
            <ShopCart2 />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: "/workspace",
    element: (
      <ProtectedRoute>
        <WorkSpaceLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/workspace/appointmentManagement",
        element: <AppointmentManagement />,
      },
      {
        path: "/workspace/personalManagement",
        element: <PersonalManagement />,
      },
      {
        path: "/workspace/servicesManagement",
        element: <ServicesManagement />,
      },
      {
        path: "/workspace/analytics",
        element: <Analytics />,
      }
    ],
  },
  {
    path: "*",
    element: <Error backgroundImage={image} />,
  }
]);

function App() {
  const { save } = useStore();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) save({ currentUser: JSON.parse(currentUser) });

    const ShopCart = localStorage.getItem("ShopCart");
    if (ShopCart) {
      save({ ShopCart: JSON.parse(ShopCart) });
    } else {
      localStorage.setItem("ShopCart", JSON.stringify([]));
      save({ ShopCart: [] });
    }

    const spaData = sessionStorage.getItem("spaData");
    if (spaData) {
      save({ spaData: JSON.parse(spaData) });
    }
  }, [save]);

  return <RouterProvider router={router} />;
}

export default App;
