"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps): React.JSX.Element {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isAuthPage = pathname.startsWith("/auth");
  const isErrorPage =
    pathname === "/error" || pathname === "/404" || pathname === "/500";

  // Don't wrap landing, auth, or error pages with the app layout
  if (isLandingPage || isAuthPage || isErrorPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Main content */}
        <main
          className={cn(
            "flex-1 relative",
            "focus:outline-none",
            // Add padding when not in full-screen mode
            !isLandingPage && "p-4"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
