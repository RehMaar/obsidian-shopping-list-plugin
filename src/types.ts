export class Item {
    name: string;
    amount: string | null;
    type: string | null;

    constructor(name: string, amount: string | null, type: string | null) {
        this.name = name;
        this.amount = amount;
        this.type = type;
    }
}