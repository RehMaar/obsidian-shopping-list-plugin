import { App, TFile, Notice, Plugin, PluginSettingTab, Setting, normalizePath, SuggestModal, getLinkpath, parseLinktext } from 'obsidian';
import store from "./store";

import { recipePostProcessor } from './recipe/postprocessor';


export default class ShoppingListPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("recipe", recipePostProcessor);
		
		parseLinktext
		// TODO: what exactly happens here?
		store.plugin.set(this);
	}
}