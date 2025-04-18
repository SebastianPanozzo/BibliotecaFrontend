import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

import Header from "./components/Header"
import Landing from "./pages/Landing"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"


const Layout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
      {/*Futuro Footer */}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Usa el Layout como contenedor
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
    ],
  },
]);


function App() {
  return (<RouterProvider router={router} />)
}

export default App
