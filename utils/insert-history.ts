"use client";

import type { fabric } from "fabric";
import { getCanvasDrawingArea } from "./get-canvas-drawing-area";
import { decode } from "base64-arraybuffer";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SketchToLogoProps } from "@/types/canvas-types";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface InsertHistoryArgs {
  outputCanvas: fabric.Canvas | fabric.StaticCanvas;
  output: string;
  input: SketchToLogoProps;
}

export async function insertHistory(
  canvas: fabric.Canvas,
  history: string[]
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const { fabric } = await import("fabric");
    const drawingArea = getCanvasDrawingArea(canvas);
    canvas.setBackgroundColor("white", () => {});

    const fileString = canvas.toDataURL({
      format: "png",
      left: drawingArea.left,
      top: drawingArea.top,
      width: drawingArea.width,
      height: drawingArea.height,
    });

    // Clean up
    canvas.setBackgroundColor(null, canvas.renderAll.bind(canvas));

    const outputFinal = fileString.substring("data:image/png;base64,".length);
    const inputUrl = history[0].substring("data:image/png;base64,".length);
    const outputUrl = history[1].substring("data:image/png;base64,".length);

    const supabase = createClientComponentClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const id = uuidv4();

    const results = await Promise.all([
      supabase.storage
        .from("images")
        .upload(`${session.user.id}/inputs/${id}.png`, decode(inputUrl), {
          contentType: "image/png",
        }),
      supabase.storage
        .from("images")
        .upload(`${session.user.id}/outputs/${id}.png`, decode(outputUrl), {
          contentType: "image/png",
        }),
      supabase.storage
        .from("images")
        .upload(
          `${session.user.id}/outputs/final_${id}.png`,
          decode(outputFinal),
          {
            contentType: "image/png",
          }
        ),
    ]);

    results[0].data.path;
    await axios.post("/api/histories", {
      ...history[0],
      input: results[0].data.path,
      output: results[1].data.path,
      outputFinal: results[2].data.path,
    });
  } catch (error) {
    console.error("Error loading fabric.js:", error);
  }
}
