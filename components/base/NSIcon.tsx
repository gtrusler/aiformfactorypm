"use client";

import React from "react";
import classNames from "classnames";

interface NSIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export const NSIcon: React.FC<NSIconProps> = ({
  name,
  className,
  ...props
}) => {
  return (
    <svg
      className={classNames("w-6 h-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {name === "trash" && (
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      )}
      {name === "undo" && (
        <path d="M3 7v6h6M3 13c0-4.4 3.6-8 8-8 3.7 0 6.8 2.5 7.7 6" />
      )}
      {name === "redo" && (
        <path d="M21 7v6h-6m6 0c0-4.4-3.6-8-8-8-3.7 0-6.8 2.5-7.7 6" />
      )}
      {name === "grid" && (
        <>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </>
      )}
      {name === "fullscreen" && (
        <>
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </>
      )}
      {name === "download" && (
        <>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </>
      )}
    </svg>
  );
};
