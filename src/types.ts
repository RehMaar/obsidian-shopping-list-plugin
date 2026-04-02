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

export function mapResult<T, U>(result: Result<T>, fn: (value: T) => U): Result<U> {
    if (result.success) {
        return ok(fn(result.value));
    } else {
        return err(result.error.message);
    }
}

export class Item {
    id: string;
    name: string;
    amount: string | null;
    type: string | null;

    constructor(name: string, amount: string | null = null, type: string | null = null) {
        this.id = crypto.randomUUID();
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

    toggleDoneAll() {
        this.toggleDone();
        this.items.map(item => {
            item.done = this.done;
        });
    }

    toggleDone() {
        this.done = !this.done;
    }

    toggleFolded() {
        this.folded = !this.folded;
    }
}

// Class to hold items along with its line number in the original note
// to be able to find the section name later when the item is added to the shopping list
//
// It looks ugly but it's a kind of optimization to avoid calculating headers when not needed.
export class ItemsWithMeta {
    items: Item[];
    bundle_start: number;

    constructor(items: Item[], bundle_start: number) {
        this.items = items;
        this.bundle_start = bundle_start;
    }
}