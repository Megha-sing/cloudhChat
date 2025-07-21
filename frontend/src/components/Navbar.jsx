import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, SunMoonIcon, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
  "
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-10 rounded-lg  flex items-center justify-center overflow-hidden">
                <img
                  src="logo-new.png"
                  alt="CloudChat Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-lg font-bold text-pink-500">CloudChat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/theme"}
              className="btn btn-soft btn-secondary transition-colors"
            >
              <SunMoonIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Theme</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="btn btn-soft btn-secondary transition-colors"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="btn btn-soft btn-secondary transition-colors"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
