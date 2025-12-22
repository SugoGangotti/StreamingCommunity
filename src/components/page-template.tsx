"use client";

import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { ThemeProvider } from "./theme-provider";

interface PageTemplateProps {
  className?: string;
  children: React.ReactNode;
}

const PageTemplate = ({ className, children }: PageTemplateProps) => {
  return (
    <div className={cn(className)}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Navbar />
        {children}
      </ThemeProvider>
    </div>
  );
};

export { PageTemplate };
