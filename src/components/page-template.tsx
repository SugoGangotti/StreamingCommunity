"use client";

import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { ThemeProvider } from "./theme-provider";
import { Outlet } from "react-router-dom";

interface PageTemplateProps {
  className?: string;
  children?: React.ReactNode;
}

const PageTemplate = ({ className }: PageTemplateProps) => {
  return (
    <div
      className={cn(className, "flex flex-col h-screen w-screen ", "bg-muted")}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        <Outlet />
      </ThemeProvider>
    </div>
  );
};

export { PageTemplate };
