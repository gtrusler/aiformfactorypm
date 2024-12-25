import { createContext } from "react";
import type { MutableRefObject } from "react";
import type { fabric } from "fabric";

export interface ICanvasContext {
  fabricRef: any;
  setFabricRef: (ref: any) => void;
  fabricLoaded: boolean;
  setFabricLoaded: (loaded: boolean) => void;
  fabricCanvas: MutableRefObject<fabric.Canvas | null>;
  setRef: (
    ref: HTMLCanvasElement | null,
    init?: (canvas: fabric.Canvas) => void
  ) => void;
  menuState: string;
  setMenuState: (state: string) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  download: (filename: string) => void;
  brushWidth: number;
  setBrushWidth: (width: number) => void;
  eraserWidth: number;
  setEraserWidth: (width: number) => void;
  addSvg: (svg: string) => void;
  addImage: (file: File) => void;
  addImageUrl: (url: string) => void;
  fullScreen: boolean;
  setFullScreen: (fullScreen: boolean) => void;
  addGridBackground: () => void;
  removeGridBackground: () => void;
  gridBackgroundActive: boolean;
  activeSelection: fabric.Object[];
  setActiveSelection: (selection: fabric.Object[]) => void;
  loadError: string | null;
}

export const CanvasContext = createContext<ICanvasContext>({
  fabricRef: null,
  setFabricRef: () => {},
  fabricLoaded: false,
  setFabricLoaded: () => {},
  fabricCanvas: { current: null } as MutableRefObject<fabric.Canvas | null>,
  setRef: () => {},
  menuState: "Select",
  setMenuState: () => {},
  undo: () => {},
  redo: () => {},
  clear: () => {},
  download: () => {},
  brushWidth: 4,
  setBrushWidth: () => {},
  eraserWidth: 4,
  setEraserWidth: () => {},
  addSvg: () => {},
  addImage: () => {},
  addImageUrl: () => {},
  fullScreen: false,
  setFullScreen: () => {},
  addGridBackground: () => {},
  removeGridBackground: () => {},
  gridBackgroundActive: false,
  activeSelection: [],
  setActiveSelection: () => {},
  loadError: null,
});
