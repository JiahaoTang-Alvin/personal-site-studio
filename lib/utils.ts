import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Block } from "@/types/block";
import type { Section } from "@/types/section";
import type { SiteConfig } from "@/types/site-config";

export const topLevelBlockSectionId = "__top_level__";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeSortOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return items.map((item, index) => ({ ...item, sortOrder: index + 1 }));
}

export function bySortOrder<T extends { sortOrder: number }>(a: T, b: T) {
  return a.sortOrder - b.sortOrder;
}

export type ContentOrderItem =
  | { id: string; type: "top-level-blocks"; blocks: Block[]; sortOrder: number }
  | { id: string; type: "section"; section: Section; sortOrder: number };

type ContentFlowNode =
  | { type: "section"; section: Section; sortOrder: number; tieOrder: number; itemOrder: number }
  | { type: "block"; block: Block; sortOrder: number; tieOrder: number; itemOrder: number };

export function getNextContentSortOrder(config: SiteConfig) {
  return Math.max(0, ...config.sections.map((section) => section.sortOrder), ...config.blocks.map((block) => block.sortOrder)) + 1;
}

export function normalizeContentFlowConfig(config: SiteConfig): SiteConfig {
  const sectionById = new Map(config.sections.map((section) => [section.id, section]));
  const contentNodes: ContentFlowNode[] = [
    ...config.sections.map((section, index) => ({
      type: "section" as const,
      section,
      sortOrder: section.sortOrder,
      tieOrder: 1,
      itemOrder: index
    })),
    ...config.blocks.map((block, index) => {
      const parentSection = sectionById.get(block.sectionId);
      const isLegacySectionBlock = block.sectionId !== topLevelBlockSectionId && parentSection;

      return {
        type: "block" as const,
        block,
        sortOrder: isLegacySectionBlock ? parentSection.sortOrder : block.sortOrder,
        tieOrder: isLegacySectionBlock ? 2 : 0,
        itemOrder: isLegacySectionBlock ? block.sortOrder : index
      };
    })
  ].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    if (a.tieOrder !== b.tieOrder) return a.tieOrder - b.tieOrder;
    return a.itemOrder - b.itemOrder;
  });

  const sectionSortOrderById = new Map<string, number>();
  const blockSortOrderById = new Map<string, number>();
  contentNodes.forEach((item, index) => {
    if (item.type === "section") {
      sectionSortOrderById.set(item.section.id, index + 1);
    } else {
      blockSortOrderById.set(item.block.id, index + 1);
    }
  });

  return {
    ...config,
    sections: config.sections.map((section) => ({
      ...section,
      sortOrder: sectionSortOrderById.get(section.id) ?? section.sortOrder
    })),
    blocks: config.blocks.map((block) => ({
      ...block,
      sectionId: topLevelBlockSectionId,
      sortOrder: blockSortOrderById.get(block.id) ?? block.sortOrder
    })),
    settings: {
      ...config.settings,
      topLevelBlocksSortOrder: undefined
    }
  };
}

export function buildRenderModel(config: SiteConfig): {
  profile: SiteConfig["profile"];
  orderedSections: Section[];
  topLevelBlocks: Block[];
  orderedContentItems: ContentOrderItem[];
} {
  const normalizedConfig = normalizeContentFlowConfig(config);
  const orderedSections = [...normalizedConfig.sections].filter((section) => section.isVisible).sort(bySortOrder);
  const topLevelBlocks: Block[] = [];

  for (const block of normalizedConfig.blocks) {
    if (!block.isVisible) {
      continue;
    }

    topLevelBlocks.push(block);
  }

  const contentSourceItems = [
    ...topLevelBlocks.map((block) => ({ id: block.id, type: "top-level-block" as const, block, sortOrder: block.sortOrder })),
    ...orderedSections.map((section) => ({ id: section.id, type: "section" as const, section, sortOrder: section.sortOrder }))
  ].sort((a, b) => (a.sortOrder === b.sortOrder ? (a.type === "top-level-block" ? -1 : 1) : a.sortOrder - b.sortOrder));
  const orderedContentItems: ContentOrderItem[] = [];
  let pendingTopLevelBlocks: Block[] = [];

  function flushTopLevelBlocks() {
    if (pendingTopLevelBlocks.length === 0) return;
    orderedContentItems.push({
      id: `top-level-blocks:${pendingTopLevelBlocks[0].id}`,
      type: "top-level-blocks",
      blocks: pendingTopLevelBlocks,
      sortOrder: pendingTopLevelBlocks[0].sortOrder
    });
    pendingTopLevelBlocks = [];
  }

  for (const item of contentSourceItems) {
    if (item.type === "top-level-block") {
      pendingTopLevelBlocks.push(item.block);
      continue;
    }

    flushTopLevelBlocks();
    orderedContentItems.push({ id: item.section.id, type: "section", section: item.section, sortOrder: item.section.sortOrder });
  }
  flushTopLevelBlocks();

  return {
    profile: config.profile,
    orderedSections,
    topLevelBlocks: [...topLevelBlocks].sort(bySortOrder),
    orderedContentItems
  };
}
