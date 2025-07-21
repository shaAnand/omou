import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Categories from "./pages/Categories.tsx";
import NotFound from "./pages/NotFound.tsx";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth", 
    element: <Auth />,
  },
  {
    path: "/categories",
    element: <Categories />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
