"use client";

import { useCallback, useEffect, useRef, useState, useContext } from "react";
import type { fabric } from "fabric";
import { CanvasContext } from "../context/CanvasContext";

export const useCanvasProvider = () => {
  const {
    fabricRef,
    setFabricRef,
    fabricLoaded,
    setFabricLoaded,
    fabricCanvas,
    setRef,
    menuState,
    setMenuState,
    undo,
    redo,
    clear,
    download,
    brushWidth,
    setBrushWidth,
    eraserWidth,
    setEraserWidth,
    addSvg,
    addImage,
    addImageUrl,
    fullScreen,
    setFullScreen,
    addGridBackground,
    removeGridBackground,
    gridBackgroundActive,
    activeSelection,
    setActiveSelection,
    loadError,
  } = useContext(CanvasContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initCanvas = async () => {
      if (typeof window === "undefined") return;
      if (!canvasRef.current) return;

      try {
        const fabricModule = await import("fabric");
        setFabricRef(fabricModule.fabric);

        const canvas = new fabricModule.fabric.Canvas(canvasRef.current, {
          width: 800,
          height: 600,
          backgroundColor: "#ffffff",
        });

        fabricCanvas.current = canvas;
        setFabricLoaded(true);
      } catch (error) {
        console.error("Error initializing fabric.js:", error);
        setFabricLoaded(false);
      }
    };

    initCanvas();

    return () => {
      fabricCanvas.current?.dispose();
    };
  }, [canvasRef, setFabricRef, setFabricLoaded, fabricCanvas]);

  return {
    fabricRef,
    setFabricRef,
    fabricLoaded,
    setFabricLoaded,
    fabricCanvas,
    setRef,
    menuState,
    setMenuState,
    undo,
    redo,
    clear,
    download,
    brushWidth,
    setBrushWidth,
    eraserWidth,
    setEraserWidth,
    addSvg,
    addImage,
    addImageUrl,
    fullScreen,
    setFullScreen,
    addGridBackground,
    removeGridBackground,
    gridBackgroundActive,
    activeSelection,
    setActiveSelection,
    loadError,
  };
};
