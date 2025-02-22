import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-white bg-opacity-90 backdrop-blur-lg border-b border-gray-200 fixed w-full top-0 z-40">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo and App Name */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">ChatTop1</h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {authUser && (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Hồ sơ</span>
              </Link>
            )}

            {/* Logout Button */}
            {authUser && (
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;