import React, { useEffect, useState } from "react";
import {
  Search,
  Activity,
  FlaskConical,
  Star,
  HelpCircle,
  LogOut,
  Bot,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { ReviewAPI } from "../utils/api";
import { useAuth } from "../state/AuthContext";
import SupportTickets from "./SupportTickets.jsx"; // ✅ Support page
import ReviewHub from "./ReviewHub.jsx"; // ✅ Full review page component

const UserDashboard = () => {
  const { token, user, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [message, setMessage] = useState({ text: "", type: "" });

  // ✅ Fetch reviews when section active
  useEffect(() => {
    if (!token || activeSection !== "reviews") return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await ReviewAPI.getMyReviews?.();
        setReviews(res?.data || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setMessage({
          text:
            err?.response?.data?.error ||
            "Failed to load reviews. Please re-login.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [activeSection, token]);

  // ✅ Logout handler
  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // ✅ Timed message hide
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Alert Message */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg text-white ${
            message.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ✅ Sidebar - DARK BLUE THEME */}
      <aside
        className="w-64 p-6 flex flex-col justify-between rounded-r-3xl shadow-lg"
        style={{
          background:
            "linear-gradient(180deg, #0A2A6B 0%, #0C357F 40%, #0D3A8A 100%)",
        }}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-xl bg-white/10 border border-white/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Digital <br />
              <span className="text-indigo-200">Healthcare Assistant</span>
            </h1>
          </div>

          {/* Sidebar Menu */}
          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: HeartPulse, label: "Dashboard" },
              { id: "reviews", icon: Star, label: "Review Hub" },
              { id: "support", icon: HelpCircle, label: "Support" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-white/20 text-white shadow-inner"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeSection === item.id
                      ? "text-white"
                      : "text-indigo-200"
                  }`}
                />{" "}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-300 hover:text-red-100 font-medium mt-8 transition"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* ✅ Main Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Dashboard Header (shown only when not Support or ReviewHub) */}
        {activeSection !== "support" && activeSection !== "reviews" && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName || "User"} 👋
            </h1>
            <p className="text-gray-600 mb-8">
              Explore your health tools and manage your activity.
            </p>
          </>
        )}

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  color: "text-blue-600",
                  title: "Medicine Lookup",
                  desc: "Find details about medicines and their usage.",
                },
                {
                  icon: Activity,
                  color: "text-indigo-600",
                  title: "Interaction Checker",
                  desc: "Check safe combinations between multiple drugs.",
                },
                {
                  icon: FlaskConical,
                  color: "text-green-600",
                  title: "Lab Test Analyzer",
                  desc: "Upload lab reports for AI-based interpretations.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
                  <card.icon className={`w-10 h-10 mb-4 ${card.color}`} />
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Meet your AI Health Assistant
                </h2>
                <p className="text-blue-100 text-sm max-w-lg">
                  Ask health-related questions or get personalized guidance.
                </p>
              </div>
              <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition">
                <Bot className="inline-block mr-2 w-5 h-5" /> Start Chat
              </button>
            </div>
          </>
        )}

        {/* ✅ Review Hub (Full Page Opens Here) */}
        {activeSection === "reviews" && <ReviewHub />}

        {/* ✅ Support Page */}
        {activeSection === "support" && <SupportTickets />}
      </main>
    </div>
  );
};

export default UserDashboard;
