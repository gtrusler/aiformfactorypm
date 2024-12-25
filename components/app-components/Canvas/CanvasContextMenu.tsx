import React from "react";
import { Menu, Item } from "react-contexify";
import { NSIcon } from "@/components/base/NSIcon";
import "react-contexify/ReactContexify.css";

const MENU_ID = "canvasContextMenu";

interface CanvasContextMenuProps {
  handleRemoveClick: () => void;
  openContextMenuOnMobile: (event: React.MouseEvent) => void;
}

const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  handleRemoveClick,
  openContextMenuOnMobile,
}) => {
  return (
    <>
      <Menu id={MENU_ID} animation={false}>
        <Item onClick={handleRemoveClick}>
          <div className="flex items-center gap-2">
            <NSIcon name="trash" className="w-5 h-5" />
            <span>Delete</span>
          </div>
        </Item>
      </Menu>
      {/* Mobile context menu */}
      <div className="flex items-center rounded-xl bg-surface-overlay min-[1080px]:hidden absolute bottom-2 left-[50%] translate-x-[-50%]">
        <button className="p-1.5 rounded-l-lg" onClick={handleRemoveClick}>
          <NSIcon name="trash" className="w-5 h-5 text-content-error" />
        </button>
        <button
          className="p-1.5 rounded-r-lg"
          onClick={openContextMenuOnMobile}
        >
          <NSIcon name="dots" className="w-5 h-5 text-content-invert" />
        </button>
      </div>
    </>
  );
};

export default CanvasContextMenu;
