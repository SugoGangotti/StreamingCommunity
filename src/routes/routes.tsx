import { Homepage } from "@/pages/homepage";
import LoginPage from "@/pages/login";
import Settings from "@/pages/settings";
import SignupPage from "@/pages/signup";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title?: string;
  showInNavbar: boolean;
}

export const routes: RouteConfig[] = [
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
    path: "/account",
    component: Settings,
    title: "Account",
    showInNavbar: true,
  },
  {
    path: "/login",
    component: LoginPage,
    title: "Login",
    showInNavbar: false,
  },
  {
    path: "/signup",
    component: SignupPage,
    title: "Sign Up",
    showInNavbar: false,
  },
];

export const routesByPath = routes.reduce((acc, route) => {
  acc[route.path] = route;
  return acc;
}, {} as Record<string, RouteConfig>);
