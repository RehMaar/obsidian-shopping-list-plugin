import { App, TFolder, AbstractInputSuggest, getIcon } from "obsidian";

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
    folderLimit: number;

    constructor(
        app: App,
        protected textInputEl: HTMLInputElement,
        folderLimit: number,
    ) {
        super(app, textInputEl);

        this.folderLimit = folderLimit;
    }

    protected getSuggestions(query: string): TFolder[] | Promise<TFolder[]> {
        query = query.trim().toLocaleLowerCase();

        let result: TFolder[] = [];
        let limit = this.folderLimit;
        for (const folder of this.app.vault.getAllFolders()) {
            if (folder.path.toLocaleLowerCase().includes(query)) {
                result.push(folder);
                limit--;
            }
            if (limit == 0)
                break;

        }
        return result;
    }

    renderSuggestion(value: TFolder, el: HTMLElement): void {
        const icon = getIcon('folder');
        if (icon) {
            icon.classList.add('suggestion-icon');
            el.append(icon);
        }
        let name = el.createSpan();
        name.style.marginLeft = "8px";
        name.appendText(value.path);
    }

    selectSuggestion(value: TFolder): void {
        this.textInputEl.value = value.path;
        this.textInputEl.trigger("input");
        this.close();
    }
}