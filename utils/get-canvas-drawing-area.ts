"use client";

import type { fabric } from "fabric";

interface DrawingArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

export async function getCanvasDrawingArea(
  canvas: fabric.Canvas
): Promise<DrawingArea> {
  if (typeof window === "undefined") {
    return { left: 0, top: 0, width: 0, height: 0 };
  }

  try {
    const { fabric } = await import("fabric");
    const objects = canvas.getObjects();
    if (objects.length === 0) {
      return {
        left: 0,
        top: 0,
        width: canvas.width || 0,
        height: canvas.height || 0,
      };
    }

    let minX = objects[0].left || 0;
    let minY = objects[0].top || 0;
    let maxX = minX + (objects[0].width || 0) * (objects[0].scaleX || 1);
    let maxY = minY + (objects[0].height || 0) * (objects[0].scaleY || 1);

    objects.forEach((obj) => {
      const objLeft = obj.left || 0;
      const objTop = obj.top || 0;
      const objWidth = (obj.width || 0) * (obj.scaleX || 1);
      const objHeight = (obj.height || 0) * (obj.scaleY || 1);

      minX = Math.min(minX, objLeft);
      minY = Math.min(minY, objTop);
      maxX = Math.max(maxX, objLeft + objWidth);
      maxY = Math.max(maxY, objTop + objHeight);
    });

    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  } catch (error) {
    console.error("Error loading fabric.js:", error);
    return { left: 0, top: 0, width: 0, height: 0 };
  }
}
