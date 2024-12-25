/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { NSIcon } from "@/components/base/NSIcon";

interface ClearButtonProps {
  clear: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ clear }) => {
  return (
    <button
      id="clear-btn"
      onClick={clear}
      data-tooltip-id="canvas-tooltip"
      data-tooltip-content="Clear Canvas"
      data-attr-shortcut="⌘⌫"
      className="p-2 rounded-lg hover:bg-surface-brand-hover"
    >
      <NSIcon name="trash" className="w-5 h-5" />
    </button>
  );
};

export default ClearButton;
