import { WorkspaceLeaf } from 'obsidian';
import { TFile } from "obsidian";
import { TextFileView } from 'obsidian';

import { BundleEntry, ok } from '../types';
import { bundleToString, parseViewData } from './utils';

import ShoppingList from './components/ShoppingList.svelte';

export const SHOPPING_LIST_VIEW_TYPE = 'shopping-list';

export class ShoppingListView extends TextFileView {
    shoppingComponent!: ShoppingList;
    entries: BundleEntry[] = [];

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
        const entries = parseViewData(data);
        if (entries.success) {
            this.entries = entries.value;
        }

        this.data = this.bundlesToString();

        if (!clear) {
            if (entries.success) {
                this.shoppingComponent.$set({ entries: entries.value });
                this.shoppingComponent.$set({ error: null });
            } else {
                this.shoppingComponent.$set({ error: entries.error });
            }
        }
    }

    clear() { }

    async onLoadFile(file: TFile): Promise<void> {
        // the most important line for saving to work! omg
        await super.onLoadFile(file);
        this.shoppingComponent = new ShoppingList({
            target: this.contentEl,
            props: {
                error: null,
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
        return this.entries.map((entry) => bundleToString(entry)).join("\n");
    }
}