"use client";

import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { ThemeProvider } from "./theme-provider";
import { Outlet } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";

interface PageTemplateProps {
  className?: string;
  children?: React.ReactNode;
}

const PageTemplate = ({ className }: PageTemplateProps) => {
  return (
    <div className="h-screen w-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ScrollArea
          className={cn(
            className,
            "flex flex-col h-screen w-screen ",
            "bg-muted"
          )}
        >
          <Navbar className="sticky top-0 z-50" />

          <Outlet />
        </ScrollArea>
      </ThemeProvider>
    </div>
  );
};

export { PageTemplate };
