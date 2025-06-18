import { Item, ItemEntry, BundleEntry } from "../types";

export function bundleToString(entry: BundleEntry): string {
    let foldedMark = entry.folded ? "+" : "-";
    let bundleString = foldedMark + ` [${entry.done ? "x" : " "}] ${entry.name}\n`;
    for (const item of entry.items) {
        bundleString += `\t- [${item.done ? "x" : " "}] ${item.item.name}: ${item.item.amount}\n`;
    }
    return bundleString;
}

export function parseViewData(data: string): BundleEntry[] {
    const lines = data.split("\n");

    let current_entry: BundleEntry | null = null;
    let entries: BundleEntry[] = [];
    console.log('aaaaaaa');
    for (const line of lines) {
        if (line.startsWith("-") || line.startsWith("+")) {
            console.log(`Processing line: ${line}`);
            // Match the bundle name in the format like "- [ ] Bundle Name" or "+ [x] Bundle Name"
            const match = line.match(/^(-|\+) \[( |x)\] (.+)$/);
            if (!match) {
                // TODO: error handling
                console.log(`Invalid line format: ${line}`);
                continue;
            }

            let folded = match?.[1] === "+";
            let done = match?.[2] === "x";
            let name = match?.[3] || "";

            if (current_entry) {
                entries.push(current_entry);
            }
            console.log(`Found bndle ${name}`);
            current_entry = new BundleEntry([], name, done, folded);

        } else if (line.trim().startsWith("-")) {
            console.log(`Processing item line: ${line}`);
            // No + parse, since items cannot be folded
            const match = line.match(/^(\t|\s+)- \[( |x)\] (.+)$/);
            if (!match) {
                console.log(`Invalid line format: ${line}`);
                continue;
            }
            console.log(`Match found: ${match}`);
            let item_format = match[3].trim().split(':');

            let done = match?.[2] === "x";
            let name = item_format[0].trim();
            let amount = item_format[1]?.trim() || null;

            if (current_entry) {
                current_entry.items.push(new ItemEntry(new Item(name, amount, null), done));
            }

        } else {
            console.log(`Ignoring line: ${line}`);
        }
    }
    if (current_entry) {
        entries.push(current_entry);
    }

    return entries;
}