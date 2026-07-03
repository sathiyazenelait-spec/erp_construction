"use client";
import React, { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ClientResponsiveHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");

  // Close sidebar automatically on route transitions
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Sync state to actual sidebar components (aside tags) on the page
  useEffect(() => {
    const asides = document.querySelectorAll("aside");
    asides.forEach((aside) => {
      if (isOpen) {
        aside.classList.add("mobile-open");
      } else {
        aside.classList.remove("mobile-open");
      }
    });

    // Manage backdrop overlay element
    let backdrop = document.getElementById("mobile-sidebar-backdrop");
    if (isOpen) {
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "mobile-sidebar-backdrop";
        backdrop.className = "sidebar-backdrop";
        backdrop.addEventListener("click", () => setIsOpen(false));
        document.body.appendChild(backdrop);
      }
    } else {
      if (backdrop) {
        backdrop.remove();
      }
    }

    // Clean up backdrop on unmount
    return () => {
      const existingBackdrop = document.getElementById("mobile-sidebar-backdrop");
      if (existingBackdrop) {
        existingBackdrop.remove();
      }
    };
  }, [isOpen]);

  // Global theme syncing
  useEffect(() => {
    const syncTheme = () => {
      const savedTheme = localStorage.getItem("buildcon_theme") || "dark";
      setTheme(savedTheme);
      if (savedTheme === "light") {
        document.body.classList.add("light-theme");
      } else {
        document.body.classList.remove("light-theme");
      }
    };
    syncTheme();
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("buildcon_theme", nextTheme);
      if (nextTheme === "light") {
        document.body.classList.add("light-theme");
      } else {
        document.body.classList.remove("light-theme");
      }
    }
  };

  // Don't show the floating menu button or theme toggle on public landing/auth pages
  const isAuthPage = 
    pathname === "/" || 
    pathname.startsWith("/login") || 
    pathname === "/signup";

  if (isAuthPage) return null;

  return (
    <div className="fixed bottom-6 right-6 md:right-8 z-50 flex flex-col gap-3">
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="mobile-toggle-btn md:hidden"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="h-[52px] w-[52px] rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl shadow-black/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-[#FF2E93]" />
        )}
      </button>
    </div>
  );
}
