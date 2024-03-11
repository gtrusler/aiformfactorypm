"use client";

import { SetStateAction, useMemo, useRef, useState } from "react";
import { FontCategory, fontCategories } from "@/types/canvas-types";
import { useVirtualizer } from "@tanstack/react-virtual";
import Fuse from "fuse.js";
import { googleFonts } from "@/types/google-fonts";
import classnames from "classnames";
import { NSInput } from "@/components/base";

const FontSelector = ({
  font,
  onFontSelect,
}: {
  font: string;
  onFontSelect: (icon: string) => void;
}) => {
  const parentRef = useRef();
  const [selectedFontCategories, setSelectedFontCategories] = useState<
    FontCategory[]
  >(["sans-serif"]);
  const [query, setQuery] = useState("");

  const filteredFonts = useMemo(() => {
    let fonts = selectedFontCategories.length
      ? googleFonts.filter((font) =>
          selectedFontCategories.includes(font.category as FontCategory)
        )
      : googleFonts;

    if (query) {
      const fuseOptions = {
        keys: ["family"],
      };

      const fuse = new Fuse(fonts, fuseOptions);

      return fuse.search(query).map((q) => q.item);
    }
    return fonts;
  }, [selectedFontCategories, query]);

  const rowVirtualizer = useVirtualizer({
    count: filteredFonts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  return (
    <div className="relative flex flex-col gap-3 py-3 bg-white">
      <div className="flex flex-wrap gap-2 mx-3">
        {fontCategories.map((category) => {
          const isSelected = selectedFontCategories.includes(category);
          return (
            <button
              key={category}
              className={`${
                isSelected
                  ? "bg-surface-brand text-content-on-brand"
                  : "bg-surface-secondary text-content-primary"
              } rounded p-1 text-2xs font-bold flex gap-1 items-center capitalize`}
              onClick={() => {
                if (isSelected) {
                  setSelectedFontCategories((prev) => [
                    ...prev.filter((i) => i !== category),
                  ]);
                } else {
                  setSelectedFontCategories((prev) => [...prev, category]);
                }
              }}
            >
              {isSelected && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8979 3.77299L4.89795 9.77299C4.84569 9.82543 4.78359 9.86704 4.71522 9.89543C4.64685 9.92382 4.57354 9.93843 4.49951 9.93843C4.42548 9.93843 4.35217 9.92382 4.2838 9.89543C4.21543 9.86704 4.15333 9.82543 4.10107 9.77299L1.47607 7.14799C1.42375 7.09566 1.38224 7.03355 1.35393 6.96518C1.32561 6.89682 1.31104 6.82355 1.31104 6.74955C1.31104 6.67555 1.32561 6.60228 1.35393 6.53392C1.38224 6.46555 1.42375 6.40344 1.47607 6.35111C1.5284 6.29879 1.59051 6.25728 1.65888 6.22897C1.72724 6.20065 1.80051 6.18607 1.87451 6.18607C1.94851 6.18607 2.02178 6.20065 2.09014 6.22897C2.15851 6.25728 2.22062 6.29879 2.27295 6.35111L4.49998 8.57814L10.102 2.97705C10.2077 2.87138 10.351 2.81201 10.5004 2.81201C10.6499 2.81201 10.7932 2.87138 10.8989 2.97705C11.0046 3.08272 11.0639 3.22604 11.0639 3.37549C11.0639 3.52493 11.0046 3.66825 10.8989 3.77393L10.8979 3.77299Z"
                    fill="white"
                  />
                </svg>
              )}
              {category}
            </button>
          );
        })}
      </div>
      <div className="mx-3">
        <NSInput
          placeholder="Search..."
          onChange={(value: { target: { value: SetStateAction<string> } }) =>
            setQuery(value.target.value)
          }
        />
      </div>
      <div
        ref={parentRef}
        className="max-h-[192px] h-[192px] overflow-y-scroll no-scrollbar pl-3 overflow-x-hidden"
      >
        <div
          className="flex flex-col"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <button
              key={virtualRow.key}
              style={{
                transform: `translateY(${virtualRow.index * 32}px)`,
              }}
              className={classnames(
                "absolute top-0 left-0 w-full h-8 border-b-[1px] border-[#F5F7F9] hover:bg-surface-brand-subdued rounded-xs",
                {
                  "bg-surface-brand-hover":
                    filteredFonts[virtualRow.index].family === font,
                }
              )}
              onClick={() =>
                onFontSelect(filteredFonts[virtualRow.index].family)
              }
            >
              <img
                className="h-3 m-auto"
                src={filteredFonts[virtualRow.index].img_url}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
