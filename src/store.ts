import { writable } from "svelte/store";
import type ShoppingListPlugin from "./main";

const plugin = writable<ShoppingListPlugin>();
export default { plugin };