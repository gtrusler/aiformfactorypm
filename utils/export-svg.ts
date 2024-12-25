"use client";

import type { fabric } from "fabric";

export async function exportSvg(canvas: fabric.Canvas): Promise<string> {
  if (typeof window === "undefined") return "";

  try {
    const { fabric } = await import("fabric");
    const svg = canvas.toSVG();
    return svg;
  } catch (error) {
    console.error("Error loading fabric.js:", error);
    return "";
  }
}
