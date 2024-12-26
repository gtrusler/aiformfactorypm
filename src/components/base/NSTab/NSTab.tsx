/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NSTabProps {
  tabs: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function NSTab({
  tabs,
  selectedTab,
  onTabChange,
  className,
}: NSTabProps): React.JSX.Element {
  const [selectorStyle, setSelectorStyle] = useState({
    width: 0,
    left: 0,
  });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const updateSelector = React.useCallback(() => {
    const selectedIndex = tabs.indexOf(selectedTab);
    const selectedTabElement = tabsRef.current[selectedIndex];

    if (selectedTabElement) {
      setSelectorStyle({
        width: selectedTabElement.offsetWidth,
        left: selectedTabElement.offsetLeft,
      });
    }
  }, [selectedTab, tabs]);

  useEffect(() => {
    updateSelector();
  }, [updateSelector]);

  useEffect(() => {
    window.addEventListener("resize", updateSelector);
    return () => window.removeEventListener("resize", updateSelector);
  }, [updateSelector]);

  return (
    <div className={cn("relative", className)}>
      <div className="flex space-x-1">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => (tabsRef.current[index] = el)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium transition-colors relative z-10",
              selectedTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        className="absolute bottom-0 h-[2px] bg-foreground transition-all duration-200"
        style={{
          width: selectorStyle.width,
          left: selectorStyle.left,
        }}
      />
    </div>
  );
}
