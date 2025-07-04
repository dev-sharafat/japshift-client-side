import { createBrowserRouter } from "react-router";
import RootLayout from "../LayOuts/RootLayOur/RootLayout";
import Home from "../pages/Home/Home";

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
]);


export default router;