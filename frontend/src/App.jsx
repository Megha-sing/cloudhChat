import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ThemePage from './pages/ThemePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js';
const App = () => {
  const { authUser, checkAuth, isCheckingAuth ,onlineUsers
  } = useAuthStore();
  console.log("Online Users:", onlineUsers);
  const location = useLocation(); 
  const {theme} = useThemeStore()
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
useEffect(() => {
    // Dynamically update the theme on <html>
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const hideNavbarRoutes = ['/login', '/signup']; 

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-pink-500" />
      </div>
    );

  return (
    <div data-theme={theme}>
      {/* Only show Navbar if current path is not login/signup */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/theme" element={<ThemePage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
