import { Modal, App } from "obsidian";

export class ConfirmModal extends Modal {
    message: string;
    onConfirm: () => void;

    constructor(app: App, message: string, onConfirm: () => void) {
        super(app);
        this.message = message;
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("div", { text: this.message, cls: "modal-message" });

        const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });

        const confirmBtn = buttonContainer.createEl("button", { text: "Yes" });
        confirmBtn.addClass("mod-cta");
        confirmBtn.onclick = () => {
            this.onConfirm();
            this.close();
        };

        const cancelBtn = buttonContainer.createEl("button", { text: "Cancel" });
        cancelBtn.onclick = () => this.close();
    }

    onClose() {
        this.contentEl.empty();
    }
}