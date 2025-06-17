import { type MarkdownPostProcessorContext } from "obsidian";
import IngredientList from "./ItemsList.svelte";
import { Item } from "./types";

export const ingredientsPostProcessor = (source: string, el: HTMLElement,  ctx: MarkdownPostProcessorContext) => {
    let items = parseShoppingList(source);

    new IngredientList({
      target: el,
      props: {
        items: items 
      }
    });
}



const parseShoppingList = (cnt: string) => {
    const lines = cnt.split("\n");
    const items = [];
    for (const line of lines) {
        const parts = line.split(":");
        if (parts.length === 2) {
            const name = parts[0].trim();
            const amount = parts[1].trim();
            items.push(new Item(name, amount, null));
        }
    }
    return items;
}