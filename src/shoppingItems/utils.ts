import { Item, type Result, ok, err, Error } from '../types';

// Function to parse a shopping list from a string
// Format:
// [-*+]? item_name(: amount)? 
//
export function parseShoppingList(cnt: string): Result<Item[]> {
    const items = [];
    const lines = cnt.split("\n");

    for (let idx = 0; idx < lines.length; idx++) {
        let line = lines[idx];
        line.trim();
        if (line.startsWith('-') || line.startsWith('+') || line.startsWith('*')) {
            line = line.slice(1).trim(); // Remove leading -/+/*
        }

        const match = line.match(/^(.+?)(:(.+?))?$/);
        if (match) {
            if (match[1] == null) {
                return err(`Found error at line ${idx + 1}: invalid item format: ${line}`);
            }

            const name = match[1].trim();
            if (name === '') {
                return err(`Found error at line ${idx + 1}: item name cannot be empty`);
            }

            const amount = match[3]?.trim() || null;
            items.push(new Item(name, amount));
        }
    }
    return ok(items);
}