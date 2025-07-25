export class Error {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export type Result<T> =
    | { success: true; value: T }
    | { success: false; error: Error };

export function ok<T>(value: T): Result<T> {
    return { success: true, value };
}

export function err(message: string): Result<never> {
    return { success: false, error: new Error(message) };
}

export class Item {
    name: string;
    amount: string | null;
    type: string | null;

    constructor(name: string, amount: string | null = null, type: string | null = null) {
        this.name = name;
        this.amount = amount;
        this.type = type;
    }
}

export class ItemEntry {
    item: Item;
    done: boolean;

    constructor(item: Item, done: boolean = false) {
        this.item = item;
        this.done = done;
    }

    toggleDone() {
        this.done = !this.done;
    }
}

export class BundleEntry {
    items: ItemEntry[];
    name: string;
    done: boolean;
    folded: boolean;

    constructor(items: ItemEntry[], name: string, done: boolean = false, folded: boolean = false) {
        this.items = items;
        this.name = name;
        this.done = done;
        this.folded = folded;
    }

    toggleDone() {
        this.done = !this.done;
        this.items.map(item => {
            item.done = this.done;
        });
    }

    toggleFolded() {
        this.folded = !this.folded;
    }
}