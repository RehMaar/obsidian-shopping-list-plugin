import { WorkspaceLeaf } from 'obsidian';
import { TFile } from "obsidian";
import { TextFileView } from 'obsidian';

import { Item, BundleEntry, ItemEntry } from './types';

import ShoppingList from './shoppingList/components/ShoppingList.svelte';

// TODO: implement proper saving
export class ShoppingListView extends TextFileView {
    shoppingComponent!: ShoppingList;
    entries: Array<BundleEntry> = [];

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    async save(clear?: boolean): Promise<void> {
        console.log("save called");


        let file = this.app.workspace.getActiveFile();
        if (file) {
            await this.app.vault.modify(file, this.data);
        } else {
            console.log("No active file to save to!");
        }
    }

    getViewType() {
        return 'shopping-list';
    }

    getDisplayText() {
        return 'Shopping List';
    }

    getViewData(): string {
        console.log(`getViewData ${this.data}`);
        return this.data;
    }

    setViewData(data: string, clear: boolean): void {
        console.log("setViewData");
        console.log(`clear: ${clear} data: ${data}`);

        const entries = this.parseViewData(data);
        this.entries = entries;
        this.shoppingComponent.$set({ entries: entries });
    }

    clear() { }

    async onLoadFile(file: TFile): Promise<void> {
        console.log(`onLoadFile ${file.path}`);
        this.data = await this.app.vault.read(file);
        console.log(`loaded ${this.data}`);
        let entries = this.parseViewData(this.data);
        this.shoppingComponent = new ShoppingList({
            target: this.contentEl,
            props: {
                entries: entries,
                onSave: (entries: BundleEntry[]) => {
                    this.data = entries.map((entry) => this.bundleToString(entry)).join("\n");
                    this.save();
                },
            }
        });

    }

    async onUnloadFile(file: TFile): Promise<void> {
        console.log(`onUnloadFile ${file.path}`);
        this.shoppingComponent.$destroy();
        this.data = "";
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

        console.log(`Parsed ${entries.length} entries`);

        return entries;
    }

}