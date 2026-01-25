import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageTemplate } from "@/components/page-template";
import { NotFound } from "@/pages/not-found";
import { getFilteredRoutesWithQueue } from "./routes";
import { useSettings } from "@/contexts/SettingsContext";

export const AppRouter = () => {
  const { enableAccounts, enableQueue } = useSettings();
  const routes = getFilteredRoutesWithQueue(enableAccounts, enableQueue);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PageTemplate />,
      children: routes.map((route) => ({
        path: route.path === "/" ? "/" : route.path.slice(1),
        element: <route.component />,
      })),
    },
    {
      path: "*",
      element: <PageTemplate />,
      children: [
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
