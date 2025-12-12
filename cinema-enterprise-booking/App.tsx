
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings, LogOut, User as UserIcon, Ticket } from 'lucide-react';
import Catalog from './views/Catalog';
import MovieDetails from './views/MovieDetails';
import Booking from './views/Booking';
import MyTickets from './views/MyTickets';
import AdminDashboard from './views/AdminDashboard';
import Login from './views/Login';
import { User, Role } from './types';

const Layout: React.FC<{ children: React.ReactNode; user: User | null; onLogout: () => void }> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!user) {
    return <div className="min-h-screen bg-cinema-900 text-white">{children}</div>;
  }

  const navItems = [
    { icon: Home, label: 'Movies', path: '/' },
    { icon: Ticket, label: 'My Tickets', path: '/tickets' },
  ];

  if (user.role === Role.ADMIN) {
    navItems.push({ icon: Settings, label: 'Admin Panel', path: '/admin' });
  }

  return (
    <div className="flex h-screen bg-cinema-900 text-white overflow-hidden font-sans">
      <aside className="w-16 lg:w-64 bg-cinema-800 border-r border-cinema-700 flex flex-col justify-between shrink-0 transition-all duration-300">
        <div>
          <div className="p-4 lg:p-6 flex items-center gap-3 justify-center lg:justify-start">
            <div className="w-8 h-8 bg-cinema-accent rounded-lg flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              C
            </div>
            <span className="text-xl font-bold hidden lg:block tracking-wide">CINEMA</span>
          </div>

          <nav className="mt-8 flex flex-col gap-2 px-2 lg:px-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors group w-full text-left ${
                  location.pathname === item.path 
                    ? 'bg-cinema-accent text-white' 
                    : 'text-gray-400 hover:bg-cinema-700 hover:text-white'
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                <span className="hidden lg:block font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-cinema-700">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cinema-900 mb-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
              <UserIcon size={14} />
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">{user.role.replace('ROLE_', '')}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors text-left"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="hidden lg:block font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-cinema-900 scroll-smooth">
         {children}
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('cinema_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('cinema_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cinema_user');
    localStorage.removeItem('token');
  };

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          
          <Route path="/" element={user ? <Catalog /> : <Navigate to="/login" />} />
          <Route path="/movie/:id" element={user ? <MovieDetails /> : <Navigate to="/login" />} />
          <Route path="/book/:movieId/:screeningId" element={user ? <Booking /> : <Navigate to="/login" />} />
          <Route path="/tickets" element={user ? <MyTickets /> : <Navigate to="/login" />} />
          
          <Route 
            path="/admin" 
            element={
              user && user.role === Role.ADMIN 
                ? <AdminDashboard /> 
                : <Navigate to="/" />
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
