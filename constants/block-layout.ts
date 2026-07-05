import type { CSSProperties } from "react";
import type { Block, BlockSize, LayoutDevice } from "@/types/block";

export const blockGridClass = "block-grid grid grid-flow-dense grid-cols-12 gap-4";

export const blockGridClassByDevice: Record<LayoutDevice, string> = {
  desktop: "admin-block-grid grid gap-4",
  mobile: "admin-block-grid grid gap-4"
};

export const blockSizeClassByDevice: Record<LayoutDevice, Record<BlockSize, string>> = {
  desktop: {
    "small-square": "col-span-4 row-span-1",
    wide: "col-span-8 row-span-1",
    "large-square": "col-span-8 row-span-2",
    "full-wide": "col-span-12 row-span-1",
    tall: "col-span-4 row-span-2"
  },
  mobile: {
    "small-square": "col-span-6 row-span-1",
    wide: "col-span-12 row-span-1",
    "large-square": "col-span-12 row-span-2",
    "full-wide": "col-span-12 row-span-1",
    tall: "col-span-6 row-span-2"
  }
};

export const blockSizeClass = blockSizeClassByDevice.desktop;

const publicMobileBlockSizeClass: Record<BlockSize, string> = {
  "small-square": "col-span-6 row-span-1",
  wide: "col-span-12 row-span-1",
  "large-square": "col-span-12 row-span-2",
  "full-wide": "col-span-12 row-span-1",
  tall: "col-span-6 row-span-2"
};

const publicDesktopBlockSizeClass: Record<BlockSize, string> = {
  "small-square": "md:col-span-4 md:row-span-1",
  wide: "md:col-span-8 md:row-span-1",
  "large-square": "md:col-span-8 md:row-span-2",
  "full-wide": "md:col-span-12 md:row-span-1",
  tall: "md:col-span-4 md:row-span-2"
};

export function getBlockSize(block: Block, device: LayoutDevice) {
  return block.responsiveSizes?.[device] ?? block.size;
}

export function getPublicBlockSizeClass(block: Block) {
  const mobileSize = getBlockSize(block, "mobile");
  const desktopSize = getBlockSize(block, "desktop");
  return `block-placement ${publicMobileBlockSizeClass[mobileSize]} ${publicDesktopBlockSizeClass[desktopSize]}`;
}

export function getDefaultGridSpan(size: BlockSize, device: LayoutDevice) {
  if (device === "mobile") {
    return size === "small-square" || size === "tall" ? 6 : 12;
  }
  if (size === "small-square" || size === "tall") return 4;
  if (size === "wide") return 8;
  if (size === "large-square") return 8;
  return 12;
}

export function getDefaultRowSpan(size: BlockSize) {
  return size === "large-square" || size === "tall" ? 2 : 1;
}

export function getBlockColumnStart(block: Block, device: LayoutDevice) {
  const size = getBlockSize(block, device);
  const span = getDefaultGridSpan(size, device);
  const rawColumnStart = block.placements?.[device]?.columnStart;
  if (!rawColumnStart) return undefined;
  return Math.max(1, Math.min(12 - span + 1, rawColumnStart));
}

export function getAdminBlockGridStyle(block: Block, device: LayoutDevice, size: BlockSize): CSSProperties {
  const columnStart = getBlockColumnStart({ ...block, responsiveSizes: { ...block.responsiveSizes, [device]: size } }, device);
  return {
    gridColumnStart: columnStart,
    gridColumnEnd: `span ${getDefaultGridSpan(size, device)}`,
    gridRowEnd: `span ${getDefaultRowSpan(size)}`
  };
}

export function getPublicBlockPlacementStyle(block: Block): CSSProperties & Record<string, string | number | undefined> {
  const mobileColumnStart = getBlockColumnStart(block, "mobile");
  const desktopColumnStart = getBlockColumnStart(block, "desktop");
  return {
    "--block-mobile-column-start": mobileColumnStart,
    "--block-desktop-column-start": desktopColumnStart
  };
}
