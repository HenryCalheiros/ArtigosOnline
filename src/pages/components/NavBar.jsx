import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [userSearch, setUserSearch] = useState("");

  const isActive = (path) => location.pathname === path;

  const handleUserSearch = (e) => {
    if (e.key === "Enter" && userSearch.trim()) {
      navigate(`/search-users?q=${userSearch}`);
      setUserSearch("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-gradient">MyApp</span>
          </Link>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <div className="hidden md:block relative">
                  <input
                    type="text"
                    placeholder="Buscar pessoas..."
                    className="pl-4 pr-4 py-1.5 text-sm rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-500/20 w-48 transition-all focus:w-64 outline-none"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={handleUserSearch}
                  />
                </div>

                <Link
                  to="/posts"
                  className={`text-sm font-medium transition-colors ${isActive('/posts') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Feed
                </Link>
                <Link
                  to="/my-posts"
                  className={`text-sm font-medium transition-colors ${isActive('/my-posts') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Meus Posts
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Perfil
                </Link>
                <Link to="/new-post">
                  <Button variant="primary" className="text-sm py-1.5 px-3">
                    Novo Post
                  </Button>
                </Link>
                <Button variant="ghost" onClick={logout} className="text-sm py-1.5 px-3 text-red-600 hover:bg-red-50 hover:text-red-700">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm py-1.5 px-3">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="text-sm py-1.5 px-3">
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
