import { type MarkdownPostProcessorContext } from "obsidian";
import ItemsList from "./ItemsList.svelte";
import { parseShoppingList } from "./utils";

export const ingredientsPostProcessor = (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
  let items = parseShoppingList(source);

  new ItemsList({
    target: el,
    props: {
      items: items
    }
  });
}

