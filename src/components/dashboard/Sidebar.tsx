import { cn } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import {
  Boxes,
  ChartNoAxesCombined,
  ChevronsUpDown,
  LogOut,
  X,
  LayoutDashboard,
  Package,
  Settings,
  Store,
  Tags,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";

const navSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "Users", to: "/users", icon: Users },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", to: "/dashboard", icon: Package },
      { label: "Categories", to: "/dashboard", icon: Tags },
      { label: "Inventory", to: "/dashboard", icon: Boxes, badge: "7" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Sales & Reports", to: "/dashboard", icon: ChartNoAxesCombined },
      { label: "Payouts", to: "/dashboard", icon: Wallet },
    ],
  },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const workspaceMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(target)
      ) {
        setIsWorkspaceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsWorkspaceMenuOpen(false);
    onClose();
    navigate("/login");
  };

  const handleMenuNavigate = () => {
    setIsWorkspaceMenuOpen(false);
    onClose();
    navigate("/dashboard");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out lg:z-20",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-sidebar-border bg-sidebar-accent/40 px-3 py-3">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-sidebar-primary p-2 text-sidebar-primary-foreground shadow-xs">
              <Store className="size-4" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-sidebar-foreground/70">
                Admin Panel
              </p>
              <h2 className="text-sm font-semibold tracking-tight">
                Shop Commerce
              </h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hoverEffect lg:hidden"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <p className="px-2 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">
              {section.title}
            </p>

            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hoverEffect",
                      isActive &&
                        "border-sidebar-primary/20 bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
                    )
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" />
                    {item.label}
                  </span>

                  {item.badge ? (
                    <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-xs font-semibold text-sidebar-accent-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
          <div ref={workspaceMenuRef} className="relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-content-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                  GV
                </span>
                <div>
                  <p className="text-sm font-semibold">Giftvaly Store</p>
                  <p className="text-xs text-sidebar-foreground/70">
                    Merchant Workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hoverEffect"
                aria-label="workspace options"
                aria-expanded={isWorkspaceMenuOpen}
                onClick={() => {
                  setIsWorkspaceMenuOpen((currentState) => !currentState);
                }}
              >
                <ChevronsUpDown className="size-4" />
              </button>
            </div>

            {isWorkspaceMenuOpen ? (
              <div className="absolute bottom-12 right-0 z-50 w-48 rounded-lg border border-sidebar-border bg-sidebar p-1.5 shadow-lg">
                <button
                  type="button"
                  onClick={handleMenuNavigate}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hoverEffect"
                >
                  <User className="size-4" />
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleMenuNavigate}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hoverEffect"
                >
                  <Settings className="size-4" />
                  Settings
                </button>
                <div className="my-1 h-px bg-sidebar-border" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 hoverEffect"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
