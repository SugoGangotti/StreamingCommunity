import { Download } from "@/pages/download";
import { Homepage } from "@/pages/homepage";
import LoginPage from "@/pages/login";
import Settings from "@/pages/settings";
import SignupPage from "@/pages/signup";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title?: string;
  showInNavbar: boolean;
  requiresAccounts?: boolean;
}

export const getAllRoutes = (): RouteConfig[] => [
  {
    path: "/",
    component: Homepage,
    title: "Home",
    showInNavbar: false,
  },
  {
    path: "/settings",
    component: Settings,
    title: "Settings",
    showInNavbar: true,
  },
  {
    path: "/download",
    component: Download,
    title: "Download",
    showInNavbar: true,
  },
  {
    path: "/login",
    component: LoginPage,
    title: "Login",
    showInNavbar: false,
    requiresAccounts: true,
  },
  {
    path: "/signup",
    component: SignupPage,
    title: "Sign Up",
    showInNavbar: false,
    requiresAccounts: true,
  },
];

export const getFilteredRoutes = (enableAccounts: boolean): RouteConfig[] => {
  const allRoutes = getAllRoutes();
  return allRoutes.filter((route) => !route.requiresAccounts || enableAccounts);
};

// Default export for backward compatibility
export const routes = getAllRoutes();
