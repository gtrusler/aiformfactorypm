"use client";

import dynamic from "next/dynamic";
import { CanvasContext } from "@/store/context/CanvasContext";
import { useCanvasProvider } from "@/store/hooks/useCanvasProvider";

// Dynamically import the Canvas component with no SSR
const Canvas = dynamic(
  () => import("@/components/app-components/Canvas/Canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full rounded-2xl bg-surface-brand animate-pulse" />
    ),
  }
);

export const CanvasShowcase = () => {
  const canvasContext = useCanvasProvider();

  return (
    <CanvasContext.Provider value={canvasContext}>
      <Canvas />
    </CanvasContext.Provider>
  );
};
