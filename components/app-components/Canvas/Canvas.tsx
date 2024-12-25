"use client";

import { useContext, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { CanvasContext } from "@/store/context/CanvasContext";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setRef, fabricLoaded } = useContext(CanvasContext);

  useEffect(() => {
    if (canvasRef.current) {
      setRef(canvasRef.current);
    }
  }, [canvasRef, setRef]);

  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full rounded-2xl bg-surface-brand animate-pulse">
        <div className="flex items-center justify-center h-full">
          <span className="text-sm text-gray-500">Loading canvas...</span>
        </div>
      </div>
    );
  }

  if (!fabricLoaded) {
    return (
      <div className="w-full h-full rounded-2xl bg-surface-brand animate-pulse">
        <div className="flex items-center justify-center h-full">
          <span className="text-sm text-gray-500">Loading canvas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full rounded-2xl" />
    </div>
  );
};

export default dynamic(() => Promise.resolve(Canvas), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-surface-brand animate-pulse">
      <div className="flex items-center justify-center h-full">
        <span className="text-sm text-gray-500">Loading canvas...</span>
      </div>
    </div>
  ),
});
