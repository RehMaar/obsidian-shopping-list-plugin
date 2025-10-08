import { type MarkdownPostProcessorContext } from "obsidian";
import ItemsList from "./ItemsList.svelte";
import { parseShoppingList } from "./utils";
import { type Result, mapResult, ItemsWithMeta } from "../types";

export const ingredientsPostProcessor = (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
  let items = parseShoppingList(source);

  let items_start_line = ctx.getSectionInfo(el)?.lineStart ?? 0;

  let meta: Result<ItemsWithMeta> = mapResult(items, it => new ItemsWithMeta(it, items_start_line));

  new ItemsList({
    target: el,
    props: {
      items_with_meta: meta
    }
  });
}

