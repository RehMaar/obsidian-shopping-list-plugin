import { App, TFile, Notice, Plugin, PluginSettingTab, Setting, normalizePath, SuggestModal } from 'obsidian';

import { type ShoppingPluginSettings, DEFAULT_SETTINGS } from './settings';
import { ingredientsPostProcessor } from './shoppingBundle/postprocessor';
import { default as isValidFilename } from 'valid-filename';

import store from "./store";
import { ItemsWithMeta } from './types';

import { ShoppingListView, SHOPPING_LIST_VIEW_TYPE } from './shoppingList/view';
import { findSectionName } from './shoppingBundle/utils';
import { FolderSuggest } from './suggester';

export default class ShoppingListPlugin extends Plugin {
	// @ts-ignore
	settings: ShoppingPluginSettings;


	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("shopping", ingredientsPostProcessor);

		this.addSettingTab(new ShoppingPluginSettingTab(this.app, this));

		this.registerView(SHOPPING_LIST_VIEW_TYPE, (leaf) => new ShoppingListView(leaf));
		this.registerExtensions([this.settings.fileExtension], SHOPPING_LIST_VIEW_TYPE);

		if (this.settings.showShoppingListRibbon) {
			this.addRibbonIcon('shopping-cart', 'Open shopping list', (evt: MouseEvent) => {
				this.openOrCreateCurrentShoppingList();
			});
		}

		store.plugin.set(this);
	}

	/// Copy the item list (aka the bundle) into the shopping list file from the settings
	public async copyToFile(items_meta: ItemsWithMeta) {
		let projectName = this.getProjectName(items_meta);
		if (!projectName) {
			new Notice("No active file found. Please open a file to copy the item list.");
			return;
		}

		let items = items_meta.items;

		const innerContent = items.map(item => `\t- [ ] ${item.name}: ${item.amount}`).join("\n");
		const content = `- [ ] ${projectName}\n` + innerContent;


		const fileName = this.getCurrentShoppingListPath();
		try {
			const existingFile = this.app.vault.getFileByPath(fileName);
			if (existingFile) {
				// We don't check the content of the file, we just append to it. User should know better!
				await this.app.vault.process(existingFile, (data: string) => {
					return data + "\n" + content;
				})
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

	getProjectName(items_with_meta: ItemsWithMeta): string | null {
		let currentFile = this.app.workspace.getActiveFile();
		if (!currentFile) {
			return null;
		}
		let projectName = currentFile.basename;
		let sectionName = this.getSectionName(currentFile, items_with_meta);
		if (sectionName) {
			projectName += `: ${sectionName}`;
		}
		return projectName;
	}

	getSectionName(currentFile: TFile, items_meta: ItemsWithMeta): string | null {
		let cache = this.app.metadataCache.getFileCache(currentFile);
		if (cache && cache?.headings) {
			let sectionName = findSectionName(cache!.headings!, items_meta.bundle_start);
			return sectionName;
		}
		return null;
	}

	getCurrentShoppingListPath(): string {
		let dir = this.settings.shoppingListDir;
		let file = this.settings.defaultShoppingListFileName;

		if (dir !== '') {
			// Ensure the directory exists
			let listDir = this.app.vault.getFolderByPath(dir);
			if (!listDir) {
				this.app.vault.createFolder(dir);
			}
		}

		return normalizePath(dir === '' ? file + '.' + this.settings.fileExtension : dir + '/' + file + '.' + this.settings.fileExtension);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async updateSettings() {
		await this.saveData(this.settings);
	}

	async openOrCreateCurrentShoppingList() {
		let filePath = this.getCurrentShoppingListPath();
		let file = this.app.vault.getFileByPath(filePath);
		if (!file) {
			file = await this.app.vault.create(filePath, '');
		}


		this.app.workspace.detachLeavesOfType(SHOPPING_LIST_VIEW_TYPE);

		let leaf = this.app.workspace.getLeaf('tab');

		await leaf.openFile(file, { active: true });
		await leaf.setViewState({
			type: SHOPPING_LIST_VIEW_TYPE,
			active: true,
			state: { filePath: filePath }
		});

		this.app.workspace.revealLeaf(leaf);
	}

}

class ExampleModal extends SuggestModal<string> {
	getSuggestions(query: string): string[] {
		return ['apple', 'banana', 'carrot'].filter(item => item.includes(query));
	}
	renderSuggestion(item: string, el: HTMLElement) {
		el.setText(item);
	}
	onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
		new Notice(`You chose ${item}`);
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
			.setName('Shopping list directory')
			.setDesc("We'll store the list there. If nothing is specified, the list will be stored in the root of your vault")
			.addSearch(search => {
				search.setValue(this.plugin.settings.shoppingListDir)
					.setPlaceholder('Enter the folder name');
				new FolderSuggest(this.plugin.app, search.inputEl, 10);
				// To check the name when it was entered fully
				search.inputEl.onblur = async () => {
					let value = search.getValue();
					if (!this.isValidDir(value)) {
						new Notice('Invalid folder name');
						return;
					}
					this.plugin.settings.shoppingListDir = value;
					await this.plugin.updateSettings();
				}
			});

		new Setting(containerEl)
			.setName('Current shopping list file name')
			.setDesc(`Set the filename for your shopping list. Keep it without a file extension, it will be added automatically`)
			.addText(text => text
				.setPlaceholder('Enter the name')
				.setValue(this.plugin.settings.defaultShoppingListFileName)
				.onChange(async (value) => {
					if (!this.isValidFile(value)) {
						new Notice(`Name ${value} isn't a valid`);
						return;
					}
					this.plugin.settings.defaultShoppingListFileName = value;
					await this.plugin.updateSettings();
				}));

		new Setting(containerEl)
			.setName('Add the shopping list ribbon')
			.setDesc('Show a ribbon in the editor for quick access to the shopping list. Requires a restart')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showShoppingListRibbon)
				.onChange(async (value) => {
					this.plugin.settings.showShoppingListRibbon = value;
					await this.plugin.updateSettings();
				}));
		/*
		// TODO: requires restart but changes are accepted immediately
		new Setting(containerEl)
			.setName('Shopping list file extension')
			.setDesc('Set the file extension for your shopping list files. Keep it one word, please. Requires a restart')
			.addText(text => text
				.setPlaceholder('Enter the file extension')
				.setValue(this.plugin.settings.fileExtension)
				.onChange(async (value) => {
					let validated = this.validateExtension(value);
					if (!validated) {
						new Notice('Invalid file extension. Please provide a non-empty value without spaces.');
						return;
					}
					this.plugin.settings.fileExtension = validated;
					await this.plugin.updateSettings();
				}));
		*/
	}

	/*
		validateExtension(value: string): string | null {
			let val = value.trim();
	
			// Basic validation: check if the value is non-empty and does not contain spaces
			if (val == '' || /\s/.test(val)) {
				return null;
			}
	
			// Remove a dot
			if (/^\./.test(val)) {
				val = val.substring(1);
			}
	
			return val;
		}
	*/

	isValidDir(value: string): boolean {
		return this.app.vault.getFolderByPath(value) !== null;
	}

	isValidFile(value: string): boolean {
		let targetFilename = value + '.' + this.plugin.settings.fileExtension;
		return isValidFilename(targetFilename);
	}


}
