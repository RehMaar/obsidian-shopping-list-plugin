import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { type ShoppingPluginSettings, DEFAULT_SETTINGS } from './settings';
import { ingredientsPostProcessor } from './shoppingItems/postprocessor';

import store from "./store";
import { Item } from './types';

import { ShoppingListView } from './view';

const SHOPPING_LIST_VIEW_TYPE = 'shopping-list';

export default class ShoppingListPlugin extends Plugin {
	// @ts-ignore
	settings: ShoppingPluginSettings;


	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("shopping", ingredientsPostProcessor);

		this.addSettingTab(new ShoppingPluginSettingTab(this.app, this));

		this.registerView('shopping-list', (leaf) => new ShoppingListView(leaf));
		this.registerExtensions(['list'], SHOPPING_LIST_VIEW_TYPE);

		store.plugin.set(this);
	}


	onunload() {

	}

	public async copyToFile(items: Array<Item>) {
		let dir = this.settings.shoppingListDir;
		let file = this.settings.defaultShoppingListFileName;

		let currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			new Notice("No active file found. Please open a file to copy the item list.");
			return;
		}
		let projectName = currentFile.basename;


		const innerContent = items.map(item => `\t- [ ] ${item.name}: ${item.amount}`).join("\n");
		const content = `- [ ] ${projectName}\n` + innerContent;


		if (dir !== '') {
			let listDir = this.app.vault.getFolderByPath(dir);
			if (!listDir) {
				this.app.vault.createFolder(dir);
			}
		}

		// TODO: do it ideomatically
		let fileName = dir === '' ? file : dir + '/' + file;

		try {
			const existingFile = this.app.vault.getFileByPath(fileName);
			if (existingFile) {
				let existingContent = await this.app.vault.read(existingFile);
				existingContent += "\n" + content;

				// We don't check the content of the file, we just append to it. User should know better!
				await this.app.vault.modify(existingFile, existingContent);
			} else {
				// If the file doesn't exist, create it
				await this.app.vault.create(fileName, content);
			}
			new Notice(`Item list is copied to ${fileName}`);
		} catch (error) {
			console.error("Failed to copy the item list:", error);
			new Notice("Failed to copy the item list");
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
