import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoAndName } from "./logo-and-name";
import { ModeToggle } from "./mode-toggle";
import { Link } from "react-router-dom";
import { UserToggle } from "./user-toggle";
import { getFilteredRoutes } from "@/routes/routes";
import { useSettings } from "@/contexts/SettingsContext";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const { enableAccounts } = useSettings();
  const routes = getFilteredRoutes(enableAccounts);
  const settings = [
    {
      title: "Dashboard",
      description: "Overview of your activity",
      href: "/dashboard",
    },
    {
      title: "Analytics",
      description: "Track your performance",
      href: "/analytics",
    },
    {
      title: "Settings",
      description: "Configure your preferences",
      href: "/settings",
    },
    {
      title: "Integrations",
      description: "Connect with other tools",
      href: "/integrations",
    },
    {
      title: "Storage",
      description: "Manage your files",
      href: "/storage",
    },
    {
      title: "Support",
      description: "Get help when needed",
      href: "/support",
    },
  ];

  return (
    <section className={cn("py-6 px-18", className)}>
      <nav
        className={cn(
          "flex flex-row justify-between w-full p-2 bg-muted",
          "bg-blue-900/80 backdrop-blur-sm",
          "border-4 border-blue-800 rounded-2xl",
        )}
      >
        <>
          <Button variant="ghost" className="p-2">
            <Link to="/">
              <LogoAndName />
            </Link>
          </Button>
        </>

        <NavigationMenu className="hidden lg:block w-full justify-around">
          <NavigationMenuList>
            {routes
              .filter((route) => route.showInNavbar)
              .map((route, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={route.path}
                      className={navigationMenuTriggerStyle()}
                    >
                      {route.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-3">
                  {settings.map((feature, index) => (
                    <NavigationMenuLink asChild>
                      <Link
                        to={feature.href}
                        key={index}
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <div key={feature.title}>
                          <p className="mb-1 font-semibold text-foreground">
                            {feature.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex gap-3 justify-end">
          {enableAccounts && <UserToggle className="hidden md:inline-flex" />}
          <ModeToggle className="hidden md:inline-flex" />

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="max-h-screen overflow-auto"
              closeButton={false}
            >
              <SheetHeader className="flex flex-row">
                <div className="w-full h-full flex flex-col justify-between">
                  <SheetTitle className="w-full">Menu</SheetTitle>
                  <SheetDescription className="w-full">
                    Version 1.0
                  </SheetDescription>
                </div>

                <ModeToggle size={"default"} className="h-full p-3" />
              </SheetHeader>

              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mt-4 mb-2">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {settings.map((feature, index) => (
                          <Link
                            to={feature.href}
                            key={index}
                            className="rounded-md p-3 transition-colors hover:bg-muted/70"
                          >
                            <div key={feature.title}>
                              <p className="mb-1 font-semibold text-foreground">
                                {feature.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex flex-col gap-6">
                  {routes
                    .filter((route) => route.showInNavbar)
                    .map((route, index) => (
                      <Link key={index} to={route.path} className="font-medium">
                        {route.title}
                      </Link>
                    ))}
                </div>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button>Chiudi</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </section>
  );
};

export { Navbar };
