import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const Homepage = () => {
  return (
    <div className="flex h-full w-full flex-row gap-4 items-center justify-center">
      <Button>Click me</Button>
      <ModeToggle />
    </div>
  );
};

export { Homepage };
