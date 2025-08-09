import { NavLink, Outlet } from "react-router-dom";

export default function CMSPage() {
  const linkStyles =
    "block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeLinkStyles = "bg-accent-light text-accent-dark font-semibold";
  const inactiveLinkStyles =
    "text-text-secondary hover:bg-accent-light/50 hover:text-accent-dark";

  return (
    <div className="flex flex-col md:flex-row gap-8 py-8 min-h-[calc(100vh-8rem)]">
      <aside className="w-full md:w-1/5 lg:w-1/6 flex-shrink-0 bg-card-bg border border-border rounded-lg p-4 self-start">
        <h2 className="text-lg font-bold text-accent-dark mb-4 px-2">
          Manage Content
        </h2>
        <nav className="space-y-1">
          <NavLink
            end
            to="/cms"
            className={({ isActive }) =>
              `${linkStyles} ${
                isActive ? activeLinkStyles : inactiveLinkStyles
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/cms/vocab"
            className={({ isActive }) =>
              `${linkStyles} ${
                isActive ? activeLinkStyles : inactiveLinkStyles
              }`
            }
          >
            Vocabulary
          </NavLink>
          <NavLink
            to="/cms/stories"
            className={({ isActive }) =>
              `${linkStyles} ${
                isActive ? activeLinkStyles : inactiveLinkStyles
              }`
            }
          >
            Stories
          </NavLink>
          <NavLink
            to="/cms/news"
            className={({ isActive }) =>
              `${linkStyles} ${
                isActive ? activeLinkStyles : inactiveLinkStyles
              }`
            }
          >
            News
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 bg-card-bg border border-border rounded-lg p-6 shadow-sm">
        <Outlet />
      </main>
    </div>
  );
}
