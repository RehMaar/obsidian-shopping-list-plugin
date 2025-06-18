import { Item, BundleEntry } from '../types';

// Function to parse a shopping list from a string
// Format:
// [-*+]? item_name(: amount)? 
//
// TODO: return errors 
export function parseShoppingList(cnt: string): Item[] {
    const lines = cnt.split("\n");
    const items = [];
    for (const line of lines) {
        const match = line.match(/^[-+*]?\s?(.+?)(:(.+?))?$/);
        if (match) {
            if (match[1] == null) {
                continue;

            }

            const name = match[1].trim();
            const amount = match[3]?.trim() || null;
            items.push(new Item(name, amount));
        }
    }
    return items;
}