"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Shares the desktop-rail collapsed state between the Sidebar and the main
// content shell (so the content padding can animate in lockstep with the rail).
const SidebarContext = createContext({
  collapsed: false,
  toggle: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

const STORAGE_KEY = "sidebar-collapsed";

export default function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // Restore the user's last choice after mount (localStorage is client-only).
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true);
  }, []);

  const toggle = () =>
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}
