import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { toggleTheme } from "../redux/themeSlice";
import { FiGrid, FiFileText, FiLogOut, FiSun, FiMoon, FiMenu, FiPlus, FiX } from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: FiGrid },
  { name: "Notes", path: "/notes", icon: FiFileText },
];

function SidebarLayout({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-3 px-1 py-2">
          <div className="flex h-9 w-9 items-center justify-center border-2 border-(--color-border-default) bg-(--color-brand) font-(family-name:--font-head) text-sm text-black shadow-(--shadow-xs)">
            N
          </div>
          <h1 className="font-(family-name:--font-head) text-base text-(--color-heading)">
            SmartNotes
          </h1>
        </div>

        <div className="mt-6 mb-6 border-2 border-(--color-border-default) bg-(--color-neutral-secondary-medium) p-3.5">
          <h2 className="truncate text-sm font-semibold text-(--color-heading)">
            {user?.name || "User"}
          </h2>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/notes" && location.pathname.startsWith("/notes/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "border-(--color-border-default) bg-(--color-brand) text-black shadow-(--shadow-xs)"
                    : "border-transparent text-(--color-body) hover:border-(--color-border-default) hover:bg-(--color-neutral-secondary-medium) hover:text-(--color-heading)"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <Link
          to="/notes/new"
          onClick={() => setMobileOpen(false)}
          className="flex w-full items-center justify-center gap-2 border-2 border-(--color-border-default) bg-(--color-brand) px-4 py-3 text-sm font-semibold text-black shadow-(--shadow-sm) transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-(--shadow-md) active:translate-x-0.5 active:translate-y-0.5 active:shadow-(--shadow-2xs)"
        >
          <FiPlus className="h-4 w-4" />
          New Note
        </Link>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex w-full items-center gap-3 border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4 py-2.5 text-sm font-semibold text-(--color-heading) shadow-(--shadow-xs) transition-all hover:bg-(--color-neutral-secondary-medium)"
        >
          {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 border-2 border-(--color-border-default) bg-(--color-danger-soft) px-4 py-2.5 text-sm font-semibold text-(--color-fg-danger-strong) shadow-(--shadow-xs) transition-all hover:bg-(--color-danger-medium)"
        >
          <FiLogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-(--color-neutral-secondary-soft) text-(--color-body)">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) md:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="fixed top-0 bottom-0 left-0 w-64 border-r-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) shadow-(--shadow-xl)"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-6 py-4 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-(--color-border-default) bg-(--color-brand) text-sm font-bold text-black">
              N
            </div>
            <span className="font-(family-name:--font-head) text-sm text-(--color-heading)">
              SmartNotes
            </span>
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="border-2 border-(--color-border-default) p-2 text-(--color-heading)"
          >
            {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 overflow-x-hidden p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default SidebarLayout;