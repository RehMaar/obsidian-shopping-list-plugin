import { WorkspaceLeaf } from 'obsidian';
import { TFile } from "obsidian";
import { TextFileView } from 'obsidian';

import { Item, BundleEntry, ItemEntry } from './types';

import ShoppingList from './shoppingList/components/ShoppingList.svelte';

export const SHOPPING_LIST_VIEW_TYPE = 'shopping-list';

export class ShoppingListView extends TextFileView {
    shoppingComponent!: ShoppingList;
    entries: Array<BundleEntry> = [];

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return SHOPPING_LIST_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Shopping List View';
    }

    getViewData(): string {
        return this.bundlesToString();
    }

    setViewData(data: string, clear: boolean): void {
        const entries = this.parseViewData(data);
        this.entries = entries;

        this.data = this.bundlesToString();

        if (!clear) {
            this.shoppingComponent.$set({ entries: entries });
        }
    }

    clear() { }

    async onLoadFile(file: TFile): Promise<void> {
        // the most important line for saving to work! omg
        await super.onLoadFile(file);
        this.shoppingComponent = new ShoppingList({
            target: this.contentEl,
            props: {
                entries: this.entries,
                onSave: (entries: BundleEntry[]) => {
                    this.entries = entries;
                    this.requestSave();
                },
            }
        });

    }

    async onUnloadFile(file: TFile): Promise<void> {
        await super.onUnloadFile(file);

        this.data = "";
        this.shoppingComponent.$destroy();
    }

    bundlesToString(): string {
        return this.entries.map((entry) => this.bundleToString(entry)).join("\n");
    }

    bundleToString(entry: BundleEntry): string {
        let foldedMark = entry.folded ? "+" : "-";
        let bundleString = foldedMark + ` [${entry.done ? "x" : " "}] ${entry.name}\n`;
        for (const item of entry.items) {
            bundleString += `\t- [${item.done ? "x" : " "}] ${item.item.name}: ${item.item.amount}\n`;
        }
        return bundleString;
    }

    parseViewData(data: string): Array<BundleEntry> {
        const lines = data.split("\n");

        let current_entry: BundleEntry | null = null;
        let entries: Array<BundleEntry> = [];
        for (const line of lines) {
            if (line.startsWith("-") || line.startsWith("+")) {
                // Match the bundle name in the format like "- [ ] Bundle Name" or "+ [x] Bundle Name"
                const match = line.match(/^(-|\+) \[( |x)\] (.+)$/);
                if (!match) {
                    console.log(`Invalid line format: ${line}`);
                    continue;
                }

                let folded = match?.[1] === "+";
                let done = match?.[2] === "x";
                let name = match?.[3] || "";

                if (current_entry) {
                    entries.push(current_entry);
                }
                current_entry = new BundleEntry([], name, done, folded);

            } else if (line.startsWith("\t-")) {
                // No + parse, since items cannot be folded
                const match = line.match(/^\t- \[( |x)\] (.+): (.+)$/);
                if (!match) {
                    console.log(`Invalid line format: ${line}`);
                    continue;
                }

                let done = match?.[1] === "x";
                let name = match?.[2] || "";
                let amount = match?.[3] || "";

                if (current_entry) {
                    current_entry.items.push(new ItemEntry(new Item(name, amount, null), done));
                }

            }
        }
        if (current_entry) {
            entries.push(current_entry);
        }

        return entries;
    }

}