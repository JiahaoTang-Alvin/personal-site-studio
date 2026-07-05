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

export function getLogicalColumnCount(device: LayoutDevice) {
  return device === "desktop" ? 3 : 2;
}

export function getLogicalColumnSpan(size: BlockSize, device: LayoutDevice) {
  const baseSpan = device === "desktop" ? 4 : 6;
  return getDefaultGridSpan(size, device) / baseSpan;
}

export function getDefaultRowSpan(size: BlockSize) {
  return size === "large-square" || size === "tall" ? 2 : 1;
}

export function getBlockLogicalColumnStart(block: Block, device: LayoutDevice) {
  const rawColumnStart = block.placements?.[device]?.columnStart;
  if (!rawColumnStart) return undefined;

  const size = getBlockSize(block, device);
  const logicalColumns = getLogicalColumnCount(device);
  const logicalSpan = getLogicalColumnSpan(size, device);
  const maxColumnStart = logicalColumns - logicalSpan + 1;
  const baseSpan = device === "desktop" ? 4 : 6;
  const logicalColumnStart =
    rawColumnStart > logicalColumns ? Math.round((rawColumnStart - 1) / baseSpan) + 1 : rawColumnStart;

  return Math.max(1, Math.min(maxColumnStart, logicalColumnStart));
}

export function getBlockColumnStart(block: Block, device: LayoutDevice) {
  const logicalColumnStart = getBlockLogicalColumnStart(block, device);
  if (!logicalColumnStart) return undefined;
  const baseSpan = device === "desktop" ? 4 : 6;
  return (logicalColumnStart - 1) * baseSpan + 1;
}

export function getBlockRowStart(block: Block, device: LayoutDevice) {
  const rawRowStart = block.placements?.[device]?.rowStart;
  if (!rawRowStart) return undefined;
  return Math.max(1, Math.min(240, rawRowStart));
}

export function getAdminBlockGridStyle(block: Block, device: LayoutDevice, size: BlockSize): CSSProperties {
  const columnStart = getBlockColumnStart({ ...block, responsiveSizes: { ...block.responsiveSizes, [device]: size } }, device);
  const rowStart = getBlockRowStart(block, device);
  return {
    gridColumnStart: columnStart,
    gridColumnEnd: `span ${getDefaultGridSpan(size, device)}`,
    gridRowStart: rowStart,
    gridRowEnd: `span ${getDefaultRowSpan(size)}`
  };
}

export function getPublicBlockPlacementStyle(block: Block): CSSProperties & Record<string, string | number | undefined> {
  const mobileColumnStart = getBlockColumnStart(block, "mobile");
  const desktopColumnStart = getBlockColumnStart(block, "desktop");
  const mobileRowStart = getBlockRowStart(block, "mobile");
  const desktopRowStart = getBlockRowStart(block, "desktop");
  return {
    "--block-mobile-column-start": mobileColumnStart,
    "--block-desktop-column-start": desktopColumnStart,
    "--block-mobile-row-start": mobileRowStart,
    "--block-desktop-row-start": desktopRowStart
  };
}
