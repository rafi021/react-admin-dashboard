import { Navigate, Outlet } from "react-router";
import Header from "./components/common/Header";
import Sidebar from "./components/dashboard/Sidebar";
import useAuthStore from "./store/useAuthStore";
import { useEffect, useState } from "react";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isSidebarOpen);

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSidebarOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
        }}
      />
      {isSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => {
            setIsSidebarOpen(false);
          }}
        />
      ) : null}
      <div className="flex min-h-screen flex-col lg:pl-72">
        <Header
          onToggleSidebar={() => {
            setIsSidebarOpen((prevState) => !prevState);
          }}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
