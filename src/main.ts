import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { MarkdownRenderChild } from "obsidian";

import { type ShoppingPluginSettings, DEFAULT_SETTINGS } from './settings';
import { ReceipeView, VIEW_TYPE_RECEIPE } from './receipe_view';
import { ingredientsPostProcessor } from './postprocessor';

import store from "./store";
import type { Item } from './types';

import { inspect } from 'util';


export default class ShoppingListPlugin extends Plugin {
	// @ts-ignore
	settings: ShoppingPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("ingredients", ingredientsPostProcessor);

		this.addSettingTab(new ShoppingPluginSettingTab(this.app, this));
	
		store.plugin.set(this);
	}

	onunload() {

	}

  public async copyToFile (items: Array<Item>) {
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
        // If the file exists, overwrite it
		let existingContent = await this.app.vault.read(existingFile);
		console.log("Existing content: ", existingContent);
		existingContent += "\n" + content;
		console.log("New content: ", existingContent);
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
