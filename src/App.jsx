import { createBrowserRouter, RouterProvider, Outlet, Navigate} from "react-router-dom";
import Header from "./components/header";
import Landing from "./pages/Landing";
import Login from "./pages/Login/login";
import Register from "./pages/Register/Register";
import ServiceTypes from "./pages/serviceTypes/serviceTypes";
import Appointment from "./pages/appointment/appointment";
import Error from "./components/LoadAndErr/Error";
import img from ".//../public/img/bgDark.webp"

const ProtectedRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return currentUser ? children : <Navigate to="/login" replace />;
};

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
        path: "/serviceTypes/:id",
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
    element: <Error backgroundImage={img}/>,
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
