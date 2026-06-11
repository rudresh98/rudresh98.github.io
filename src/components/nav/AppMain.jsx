"use client";

import { useSidebar } from "@/components/providers/SidebarProvider";

// Main content shell. Left padding tracks the desktop rail width and animates
// in sync when it collapses/expands. Mobile keeps the top-bar offset (pt-16).
export default function AppMain({ children }) {
  const { collapsed } = useSidebar();

  return (
    <main
      id="main"
      className={`relative flex min-h-[100dvh] flex-col pt-16 transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:pt-0 ${
        collapsed ? "md:pl-20" : "md:pl-72"
      }`}
    >
      {children}
    </main>
  );
}
