import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Header from "./components/Header"
import Landing from "./pages/Landing"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import ServiceTypes from "./pages/serviceTypes/serviceTypes";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
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
      {
        path: "/serviceTypes/:id",
        element: <ServiceTypes />,
      },
    ],
  },
]);

function App() {
  return (<RouterProvider router={router} />)
}

export default App
