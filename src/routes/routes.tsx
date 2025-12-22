import { Homepage } from "@/pages/homepage";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title?: string;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: Homepage,
    title: "Home",
  },
  {
    path: "/login",
    component: LoginPage,
    title: "Login",
  },
  {
    path: "/signup",
    component: SignupPage,
    title: "Sign Up",
  },
];

export const routesByPath = routes.reduce((acc, route) => {
  acc[route.path] = route;
  return acc;
}, {} as Record<string, RouteConfig>);
