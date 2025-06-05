import { useEffect } from "react";
import useStore from "./hooks/useStore";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LandingLayout from "./pages/Landing"
import Sections from "./pages/Landing/Sections";
import Login from "./pages/Login/login";
import Register from "./pages/Register/Register";
import ServiceTypes from "./pages/Landing/serviceTypes/serviceTypes";
import ShopCart from "./pages/Landing/ShopCart/ShopCart";
import ShopCart2 from "./pages/Landing/ShopCart/ShopCart2";
import Appointments from "./pages/Landing/Appointments/Appointments"
import Profile from "./pages/Landing/Profile"

import WorkSpaceLayout from "./pages/WorkSpace";
import AppointmentManagement from "./pages/WorkSpace/AppointmentManagement";
import PersonalManagement from "./pages/WorkSpace/PersonalManagement";
import ServicesManagement from "./pages/WorkSpace/ServicesManagement";
import Analytics from "./pages/WorkSpace/Analytics";

import Error from "./components/LoadAndErr/Error";
import image from "../public/img/bgDark.webp"

const ProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser ? children : <Navigate to="/login" replace />;
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
        path: "/appointments",
        element: (
          <ProtectedRoute>
            <Appointments />
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
    element: <WorkSpaceLayout />,
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
