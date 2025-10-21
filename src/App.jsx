import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Pill,
  Home,
  FileText,
  Info,
  LogOut,
  User,
  Shield,
} from "lucide-react";

// ✅ Import pages
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/Signup.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import MedicinesPage from "./pages/MedicinesPage.jsx";
import AboutPage from "./pages/AboutPage.jsx"; // <-- will now get onNavigate prop
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// ✅ Auth Context
import { AuthProvider, useAuth } from "./state/AuthContext.jsx";


// -------------------- Header --------------------
const Header = ({ currentPage, setCurrentPage, scrolled }) => {
  const { user, setUser, setToken } = useAuth();
  const isAdmin = user?.role === "admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("hp:user");
    localStorage.removeItem("hp:token");
    setUser(null);
    setToken(null);
    setCurrentPage("home");
  };

  const publicNavigation = [
    { name: "Home", page: "home", icon: Home },
    { name: "Articles", page: "articles", icon: FileText },
    { name: "Medicines", page: "medicines", icon: Pill },
    { name: "About Us", page: "about", icon: Info },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-white"
                fill="currentColor"
              >
                <path d="M6 5a1 1 0 0 1 2 0v5a4 4 0 1 0 8 0V5a1 1 0 1 1 2 0v5a6 6 0 0 1-5 5.917V18a3 3 0 1 1-2 0v-2.083A6 6 0 0 1 6 10V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Digital Healthcare
              </h1>
              <p className="text-xs text-gray-500">Assistant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicNavigation.map((item) => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === item.page
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <span className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Admin
                  </span>
                )}
                <button
                  onClick={() =>
                    setCurrentPage(isAdmin ? "admin-dashboard" : "user-dashboard")
                  }
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentPage("login")}
                  className="px-6 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage("signup")}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="space-y-2">
              {publicNavigation.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    currentPage === item.page
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => {
                    setCurrentPage(isAdmin ? "admin-dashboard" : "user-dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-5 h-5" />
                  Dashboard
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};


// -------------------- Footer --------------------
const Footer = () => (
  <footer className="bg-slate-950 text-slate-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M6 5a1 1 0 0 1 2 0v5a4 4 0 1 0 8 0V5a1 1 0 1 1 2 0v5a6 6 0 0 1-5 5.917V18a3 3 0 1 1-2 0v-2.083A6 6 0 0 1 6 10V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">Digital Healthcare</h3>
              <p className="text-xs text-slate-400">Assistant</p>
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Your trusted partner in healthcare information and patient empowerment.
          </p>
        </div>

        <div className="md:justify-self-end md:text-right">
          <h4 className="font-semibold text-white mb-4">Connect</h4>
          <div className="flex gap-3 md:justify-end">
            {/* Social Buttons (unchanged) */}
            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M13 22v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v2H6v4h3v9z" />
              </svg>
            </a>
            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M17 3h3l-7 9 7 9h-3l-6-8-6 8H2l7-9-7-9h3l6 8z" />
              </svg>
            </a>
            <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-lg flex items-center justify-center transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M6.94 6.5A1.94 1.94 0 1 1 5 4.56 1.94 1.94 0 0 1 6.94 6.5zM5.5 8.5h2.9V20H5.5zM10.5 8.5h2.78v1.57h.04a3.05 3.05 0 0 1 2.74-1.5c2.94 0 3.48 1.94 3.48 4.45V20h-2.9v-4.89c0-1.17 0-2.67-1.63-2.67s-1.88 1.27-1.88 2.59V20H10.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Digital Health Care Assistant. All rights reserved.
      </div>
    </div>
  </footer>
);


// -------------------- Main App --------------------
const App = () => {
  const { user, setUser, token, setToken } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("hp:user"));
      const savedToken = localStorage.getItem("hp:token");
      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
        setCurrentPage(savedUser.role === "admin" ? "admin-dashboard" : "user-dashboard");
      }
    } catch (err) {
      console.error("Failed to restore session:", err);
    }
  }, []);

  const renderPage = () => {
    if (currentPage === "login")
      return (
        <LoginPage
          onSwitchToSignup={() => setCurrentPage("signup")}
          onLoginSuccess={(token, role) => {
            localStorage.setItem("hp:token", token);
            setToken(token);
            const storedUser = JSON.parse(localStorage.getItem("hp:user"));
            if (storedUser) setUser(storedUser);
            setCurrentPage(role === "admin" ? "admin-dashboard" : "user-dashboard");
          }}
        />
      );

    if (currentPage === "signup")
      return <SignupPage onSwitchToLogin={() => setCurrentPage("login")} />;

    const showHeaderFooter = !["user-dashboard", "admin-dashboard"].includes(currentPage);

    return (
      <>
        {showHeaderFooter && (
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} scrolled={scrolled} />
        )}

        <main className="min-h-screen">
          {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
          {currentPage === "articles" && <ArticlesPage token={token} isAdmin={isAdmin} />}
          {currentPage === "medicines" && <MedicinesPage token={token} isAdmin={isAdmin} />}
          
          {/* ✅ pass navigation prop to AboutPage */}
          {currentPage === "about" && <AboutPage onNavigate={setCurrentPage} />}

          {currentPage === "user-dashboard" && user && <UserDashboard />}
          {currentPage === "admin-dashboard" && user && isAdmin && <AdminDashboard />}
        </main>

        {showHeaderFooter && <Footer />}
      </>
    );
  };

  return <div className="min-h-screen bg-white">{renderPage()}</div>;
};

// -------------------- Root --------------------
export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
