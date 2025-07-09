import { createBrowserRouter } from "react-router";
import RootLayout from "../LayOuts/RootLayOur/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayOut from "../LayOuts/AuthLayOut/AuthLayOut";
import Login from "../pages/Login/Login";
import Sign from "../pages/SignIn/Sign";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoutes from "../routes/PrivateRoutes";
import SendParsel from "../pages/SendParsel/SendParsel";
import MyParcel from "../pages/DeshboardPages/MyParcel";
import DashboardLayout from "../LayOuts/DashBoard/DashboardLayout";
import DeshboardHome from "../pages/DeshboardPages/DeshboardHome";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/coverage",
        Component: Coverage,
        loader: () => fetch("./CenterDatas.json"),
      },
      {
        path: "sendParel",
        element: (
          <PrivateRoutes>
            <SendParsel />
          </PrivateRoutes>
        ),
        loader: () => fetch("./CenterDatas.json"),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayOut,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signin",
        Component: Sign,
      },
    ],
  },
  {
    path: "/deshboard",
    element:
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ,
    children: [
      {
        path:"myPercel",
        element:<MyParcel></MyParcel>
      },
    ],
  },
]);

export default router;
