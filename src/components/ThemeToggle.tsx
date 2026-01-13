import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  showLabel?: boolean;
}

const ThemeToggle = ({ showLabel = false }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  if (showLabel) {
    return (
      <Button
        variant="ghost"
        onClick={toggleTheme}
        className="rounded-full gap-3 px-4 justify-start"
      >
        <div className="relative w-5 h-5 shrink-0">
          <Sun className="h-5 w-5 absolute rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="h-5 w-5 absolute rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        </div>
        <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10"
    >
      <div className="relative w-5 h-5">
        <Sun className="h-5 w-5 absolute rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="h-5 w-5 absolute rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
