import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";

export default function Navbar() {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const linkStyles =
    "block md:px-3 py-2 rounded-md text-base md:text-sm font-medium transition-colors";
  const activeLinkStyles = "bg-accent-light text-accent-dark";
  const inactiveLinkStyles =
    "text-text-secondary hover:bg-accent-light/50 hover:text-accent-dark";

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${linkStyles} ${isActive ? activeLinkStyles : inactiveLinkStyles}`
        }
        onClick={() => setIsOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/vocab"
        className={({ isActive }) =>
          `${linkStyles} ${isActive ? activeLinkStyles : inactiveLinkStyles}`
        }
        onClick={() => setIsOpen(false)}
      >
        Vocab
      </NavLink>
      <NavLink
        to="/story"
        className={({ isActive }) =>
          `${linkStyles} ${isActive ? activeLinkStyles : inactiveLinkStyles}`
        }
        onClick={() => setIsOpen(false)}
      >
        Stories
      </NavLink>
      <NavLink
        to="/news"
        className={({ isActive }) =>
          `${linkStyles} ${isActive ? activeLinkStyles : inactiveLinkStyles}`
        }
        onClick={() => setIsOpen(false)}
      >
        News
      </NavLink>
    </>
  );

  return (
    <nav className="bg-card-bg/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-accent-dark">
              汉字 Hub
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks}
            </div>
          </div>
          <div className="hidden md:block">
            {session && (
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary text-sm">
                  {session.user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary !py-1.5 !px-3 !text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-card-bg p-2 inline-flex items-center justify-center rounded-md text-text-secondary hover:text-accent-dark hover:bg-accent-light"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks}
            {session && (
              <div className="pt-4 border-t border-border">
                <span className="block text-text-secondary text-sm px-3 py-2">
                  {session.user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="w-full text-left btn-secondary !py-2 !px-3"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
