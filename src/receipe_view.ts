import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_RECEIPE = 'receipe-view';

export class ReceipeView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_RECEIPE;
    }

    getDisplayText() {
        return 'Parsed receipe view';
    }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl('h4', { text: 'Ingredients 2' });
    }

    async onClose() {
        // Nothing to clean up.
    }
}
