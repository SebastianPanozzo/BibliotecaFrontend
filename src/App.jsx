import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Header from "./components/header";
import Landing from "./pages/Landing";
import Login from "./pages/Login/login";
import Register from "./pages/Register/Register";
import ServiceTypes from "./pages/serviceTypes/serviceTypes";
import Appointment from "./pages/appointment/appointment";

import Loader from "./components/LoadAndErr/Loader";
import Error from "./components/LoadAndErr/Error";

import image from "../public/img/bgDark.webp"

import useFetchData from "./hooks/useFetchData";
import useStore from "./hooks/useStore";

const ProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser ? children : <Navigate to="/login" replace />;
};

const Layout = () => {
  const { save, get } = useStore();
  const { spaData } = get();
  const { trigger, error, isMutating } = useFetchData('/api/findObjects');

  useEffect(() => {
    const fetch = async () => {
      try {
        const body = [{ "$match": { "_id": { "$eq": import.meta.env.VITE_SPA_ID } } }]

        const data = await trigger({
          method: 'POST',
          body: body
        });

        save({ spaData: data.items[0] });

      } catch (err) {
        console.error('Error al hacer la request:', err.message);
      }

    }
    fetch()
  }, [save, trigger]);


  //Agregar acá lo del carrito
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      save({ currentUser: JSON.parse(currentUser) });
    }

    const ShopCart = localStorage.getItem("ShopCart");
    if (ShopCart) {
      save({ ShopCart: JSON.parse(ShopCart) });
    } else {
      localStorage.setItem("ShopCart", JSON.stringify([]));
      save({ ShopCart: [] });
    }

  }, [save]);

  return (
    <>
      <Header />
      {isMutating && <Loader context={{ image }} />}
      {error && < Error backgroundImage={image} />}
      {spaData && <Outlet />}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
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
        path: "/appointment/:id",
        element: (
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Error backgroundImage={image} />,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
