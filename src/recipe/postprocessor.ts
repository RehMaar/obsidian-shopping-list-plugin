import { type MarkdownPostProcessorContext } from "obsidian";
import { parse } from "./parser/parser";
import RecipeView from "./svelte/RecipeView.svelte";

export function recipePostProcessor(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    let result = parse(source);
    new RecipeView({
        target: el,
        props: {
            recipe: result.recipe,
            errors: result.errors,
        }
    });
}