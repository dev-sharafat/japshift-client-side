import { createBrowserRouter } from "react-router";
import RootLayout from "../LayOuts/RootLayOur/RootLayout";
import Home from "../pages/Home/Home";
import AuthLayOut from "../LayOuts/AuthLayOut/AuthLayOut";
import Login from "../pages/Login/Login";
import Sign from "../pages/SignIn/Sign";

const router = createBrowserRouter([
  {
   path:'/',
   Component:RootLayout,
   children:[
    {
      index:true,
      Component:Home
    }
   ]
  },
  {
    path:'/',
    Component:AuthLayOut,
    children:[
      {
        path:'login',
        Component:Login
      },
      {
        path:'signin',
        Component:Sign
      }
    ]
  }
]);


export default router;