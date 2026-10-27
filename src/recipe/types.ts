export class Ratio {
	numerator: number;
	denominator: number;
	constructor(numerator: number, denominator: number) {
		this.numerator = numerator;
		this.denominator = denominator;
	}
}

export type AmountType = number | Ratio;

export class Amount {
	amount: AmountType;
	unit: string | null;

	constructor(amount: AmountType, unit: string | null = null) {
		this.amount = amount;
		this.unit = unit;
	}
}

export class RawItem {
	name: string;
	amount: Amount | string | null;

	constructor(name: string, amount: Amount | string | null = null) {
		this.name = name;
		this.amount = amount;
	}
}

export class RecipeLink {
    linkName: string | null;
	link: string;
	portions: AmountType;

	constructor(link: string, linkName: string | null, portions: AmountType) {
		this.link = link;
        this.linkName = linkName;
		this.portions = portions;
	}
}

export type Item = RawItem | RecipeLink;

export class RecordedItem {
	item: Item;
	comment: string | null;
	should_be_bought: boolean; 

	constructor(item: Item, should_be_bought: boolean, comment: string | null = null) {
		this.item = item;
        this.should_be_bought = should_be_bought;
		this.comment = comment;
	}
}

export class RecipeRecord {
	item: RecordedItem;
	alternatives: RecordedItem[] | null;

	constructor(item: RecordedItem, alternatives: RecordedItem[] | null = null) {
		this.item = item;
		this.alternatives = alternatives;
	}
}

export class Recipe {
	defined_portions: number;
	list: RecipeRecord[];

	constructor(portions: number, list: RecipeRecord[]) {
		this.defined_portions = portions;
		this.list = list;
	}
}
