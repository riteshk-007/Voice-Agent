import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  Briefcase,
  Mic,
  LayoutDashboard,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/jobs", icon: <Briefcase size={20} />, label: "Jobs" },
    { path: "/candidates", icon: <Users size={20} />, label: "Candidates" },
    {
      path: "/appointments",
      icon: <Calendar size={20} />,
      label: "Appointments",
    },
    {
      path: "/voice-simulation",
      icon: <Mic size={20} />,
      label: "Voice Simulation",
    },
    {
      path: "/documentation",
      icon: <FileText size={20} />,
      label: "Documentation",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-md">
        <div className="flex h-20 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-primary">Voice Agent</h1>
        </div>
        <nav className="mt-5 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute right-0 h-8 w-1 rounded-l-full bg-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
