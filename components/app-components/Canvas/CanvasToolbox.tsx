import React, { RefObject } from "react";
import classnames from "classnames";
import { NSIcon } from "@/components/base/NSIcon";

interface CanvasToolboxProps {
  menuState: string;
  setMenuState: (state: string) => void;
  brushWidth: number;
  setBrushWidth: (width: number) => void;
  addSvg: (svg: string) => void;
  addImageUrl: (url: string) => void;
  inputFile: RefObject<HTMLInputElement>;
  eraserWidth: number;
  setEraserWidth: (width: number) => void;
  className?: string;
}

const CanvasToolbox: React.FC<CanvasToolboxProps> = ({
  menuState,
  setMenuState,
  brushWidth,
  setBrushWidth,
  addSvg,
  addImageUrl,
  inputFile,
  eraserWidth,
  setEraserWidth,
  className,
}) => {
  return (
    <div
      className={classnames(
        "flex items-center gap-2 p-2 bg-white rounded-2xl",
        className
      )}
    >
      <button
        onClick={() => setMenuState("Select")}
        className={classnames("p-2 rounded-lg hover:bg-surface-brand-hover", {
          "bg-surface-brand-hover": menuState === "Select",
        })}
      >
        <NSIcon name="cursor" className="w-5 h-5" />
      </button>
      <button
        onClick={() => setMenuState("Brush")}
        className={classnames("p-2 rounded-lg hover:bg-surface-brand-hover", {
          "bg-surface-brand-hover": menuState === "Brush",
        })}
      >
        <NSIcon name="brush" className="w-5 h-5" />
      </button>
      <button
        onClick={() => setMenuState("Eraser")}
        className={classnames("p-2 rounded-lg hover:bg-surface-brand-hover", {
          "bg-surface-brand-hover": menuState === "Eraser",
        })}
      >
        <NSIcon name="eraser" className="w-5 h-5" />
      </button>
      <button
        onClick={() => setMenuState("Line")}
        className={classnames("p-2 rounded-lg hover:bg-surface-brand-hover", {
          "bg-surface-brand-hover": menuState === "Line",
        })}
      >
        <NSIcon name="line" className="w-5 h-5" />
      </button>
      <div className="w-[1px] h-5 bg-border-disabled"></div>
      {menuState === "Brush" && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="50"
            value={brushWidth}
            onChange={(e) => setBrushWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm">{brushWidth}px</span>
        </div>
      )}
      {menuState === "Eraser" && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="50"
            value={eraserWidth}
            onChange={(e) => setEraserWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm">{eraserWidth}px</span>
        </div>
      )}
    </div>
  );
};

export default CanvasToolbox;
