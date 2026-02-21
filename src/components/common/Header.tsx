import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/store/useAuthStore";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  onToggleSidebar: () => void;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3 md:items-center">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
          >
            <Menu className="size-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
              E-commerce Admin Dashboard
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground md:mt-0">
              Welcome back, {user?.name ?? "Admin"}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto md:gap-3">
          <div className="relative w-full sm:min-w-55 sm:flex-1 md:w-72 md:flex-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search orders, products..." />
          </div>

          <Button variant="outline" size="icon" aria-label="notifications">
            <Bell className="size-4" />
          </Button>
          <ThemeToggle />
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
