import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { MarkdownRenderChild, TFile } from "obsidian";
import { TextFileView } from 'obsidian';

import { type ShoppingPluginSettings, DEFAULT_SETTINGS } from './settings';
import { ingredientsPostProcessor } from './shoppingItems/postprocessor';

import store from "./store";
import { Item, BundleEntry, ItemEntry } from './types';

import { inspect } from 'util';
import ShoppingList from './shoppingList/components/ShoppingList.svelte';

const SHOPPING_LIST_VIEW_TYPE = 'shopping-list';

class ShoppingListView extends TextFileView {
	plugin: ShoppingListPlugin;

	shoppingComponent!: ShoppingList;
	entries: Array<BundleEntry> = [];

	constructor(leaf: WorkspaceLeaf, plugin: ShoppingListPlugin) {
		super(leaf);
		this.plugin = plugin;
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
				onSave: (entries) => {
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


export default class ShoppingListPlugin extends Plugin {
	// @ts-ignore
	settings: ShoppingPluginSettings;


	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("shoppingItems", ingredientsPostProcessor);

		this.addSettingTab(new ShoppingPluginSettingTab(this.app, this));

		this.registerView('shopping-list', (leaf) => new ShoppingListView(leaf, this));
		this.registerExtensions(['list'], SHOPPING_LIST_VIEW_TYPE);

		store.plugin.set(this);
	}


	onunload() {

	}

	public async copyToFile(items: Array<Item>) {
		let currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			new Notice("No active file found. Please open a file to copy the item list.");
			return;
		}
		let projectName = currentFile.basename;


		const innerContent = items.map(item => `\t- [ ] ${item.name}: ${item.amount}`).join("\n");
		const content = `- [ ] ${projectName}\n` + innerContent;

		let listDir = this.app.vault.getFolderByPath(this.settings.shoppingListDir);
		if (!listDir) {
			new Notice(`Directory ${listDir} not found. Please check your settings.`);
			return;
		}

		// TODO: do it ideomatically
		let fileName = this.settings.shoppingListDir + '/' + this.settings.defaultShoppingListFileName;

		try {
			const existingFile = this.app.vault.getFileByPath(fileName);
			if (existingFile) {
				let existingContent = await this.app.vault.read(existingFile);
				existingContent += "\n" + content;

				await this.app.vault.modify(existingFile, existingContent);
			} else {
				// If the file doesn't exist, create it
				await this.app.vault.create(fileName, content);
			}
			new Notice(`Item list is copied to ${fileName}`);
		} catch (error) {
			console.error("Failed to copy the item list:", error);
			new Notice("Failed to copy the item list. Check the console for details.");
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async updateSettings() {
		console.log('Updating settings');
		console.log(this.settings);
		await this.saveData(this.settings);
	}

}

export class ShoppingPluginSettingTab extends PluginSettingTab {
	plugin: ShoppingListPlugin;

	constructor(app: App, plugin: ShoppingListPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Shopping List Directory')
			.setDesc('In this directory we will store the shopping lists')
			.addText(text => text
				.setPlaceholder('Enter the path')
				.setValue(this.plugin.settings.shoppingListDir)
				.onChange(async (value) => {
					this.plugin.settings.shoppingListDir = value;
					await this.plugin.updateSettings();
				}));

		new Setting(containerEl)
			.setName('Current Shopping List file name')
			.setDesc('This is the shopping lists main file')
			.addText(text => text
				.setPlaceholder('Enter the name')
				.setValue(this.plugin.settings.defaultShoppingListFileName)
				.onChange(async (value) => {
					this.plugin.settings.defaultShoppingListFileName = value;
					await this.plugin.updateSettings();
				}));
	}
}
