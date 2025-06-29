import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Admin from "@/pages/Admin/Admin";
import BlogDetails from "@/pages/BlogDetails";
import Blogs from "@/pages/Blogs";
import CallbackTurno from "@/pages/CallbackTurno";
import Coworking from "@/pages/Coworking/Coworking";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Turnos from "@/pages/Turnos/Turnos";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
const routers = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <h1>FAIL HOME</h1>,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <h1>FAIL LOGIN</h1>,
      },{
        path: "/admin",
        element: <Admin />,
        errorElement: <h1>FAIL ADMIN</h1>,

      }
      ,{
        path: "/turnos",
        element: <Turnos />,
        errorElement: <h1>FAIL TURNOS</h1>,

      }
      ,{
        path: "/callback/:token",
        element: <CallbackTurno />,
        errorElement: <h1>FAIL TURNOS</h1>,

      }
      ,{
        path: "/blogs",
        element: <Blogs />,
        errorElement: <h1>FAIL TURNOS</h1>,

      }
      ,{
        path: "/blog/:id",
        element: <BlogDetails />,
        errorElement: <h1>FAIL TURNOS</h1>,

      }
      ,{
        path: "/coworking",
        element: <Coworking />,
        errorElement: <h1>FAIL TURNOS</h1>,

      }
    ],
  },
]);

function RoutesWeb() {
  return <RouterProvider router={routers} />;
}

export default RoutesWeb;
