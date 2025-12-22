import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageTemplate } from "@/components/page-template";
import { routes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageTemplate />,
    children: routes.map((route) => ({
      path: route.path === "/" ? "/" : route.path.slice(1),
      element: <route.component />,
    })),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
