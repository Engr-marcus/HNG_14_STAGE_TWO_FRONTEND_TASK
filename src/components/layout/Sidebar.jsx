import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { logo, avatar, moon, sun } from "../../assets";

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="5" stroke="#858bb2" strokeWidth="2" />
      <path
        d="M10 1v2M10 17v2M1 10h2M17 10h2M3.5 3.5l1.4 1.4M15.1 15.1l1.4 1.4M3.5 16.5l1.4-1.4M15.1 4.9l1.4-1.4"
        stroke="#858bb2" strokeWidth="2" strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        stroke="#858bb2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className="sidebar" aria-label="Application sidebar">
      {/* Logo */}
      <div className="sidebar__logo" aria-label="Invoice App logo">
        <img src={logo} alt="Invoice App logo" width={32} height={32} />
      </div>

      {/* Bottom controls */}
      <div className="sidebar__bottom">
        <button
          className="sidebar__btn"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title="Toggle dark mode"
        >
          <img
            src={isDark ? sun : moon}
            alt={isDark ? "Light mode" : "Dark mode"}
            width={20}
            height={20}
          />
        </button>

        <div className="sidebar__divider" aria-hidden="true" />

        <button className="sidebar__btn sidebar__btn--avatar" aria-label="User profile">
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#494e6e" />
            <circle cx="16" cy="13" r="5" fill="#858bb2" />
            <ellipse cx="16" cy="26" rx="9" ry="6" fill="#858bb2" />
          </svg>
        </button>
      </div>
    </aside>
  );
}