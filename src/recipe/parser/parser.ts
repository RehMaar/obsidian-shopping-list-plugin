import { Amount, RecordedItem, RecipeRecord, Recipe } from "../types";
import { parsePortions, parseRecordedItem } from "./inner";
import { ParseError, ParseErrorType, ParseRecordError } from "./types";

/*
 * ```shopping
#Portions 2
- Ingredient 1, <amount> <amount measurement> #comment
  - Possible substitution 1, <amount> <amount measurement>
  - Possible substitution 2, <amount> <amount measurement>
- Ingredient 2
- [[^^block|Complex Ingredient 3]], <number of portions>
* Ingredient 3 #comment
```
 * 
 * For more flexible parsing, we make the focal points in the format:
 * - the last # in the line is the start of a comment
 * - the last , in the line (before #) is the start of an amount
 * 
 */
export function parse(text: string): { recipe: Recipe, errors: ParseError[]} {
	var lines = text.split('\n');
	var portions = 1;
	var items = [];
	var line_offset = 0;

	var errors: ParseError[] = [];

	if (lines[0].startsWith('#')) {
		portions = parsePortions(lines[0]);
		lines = lines.slice(1);
		line_offset = 1;
	}
	
	for (let i = 0; i < lines.length; i ++) {
		let lineNum = i + 1 + line_offset;
		let line = lines[i];
		if (line.startsWith('-') || line.startsWith('*')) {
			var item = parseRecordedItem(line);
			if (item instanceof ParseRecordError) {
				errors.push(new ParseError(lineNum, item.type));
			} else {
				items.push(new RecipeRecord(item, null));
			}
		} else if (line.startsWith(' ')) {
			// alternatives for the last item
			var item = parseRecordedItem(line.trimStart());
			if (item instanceof ParseRecordError) {
				errors.push(new ParseError(lineNum, item.type));
			} else {
				if (items.length > 0) {
					var last_item = items[items.length - 1];
					if (last_item.alternatives === null) {
						last_item.alternatives = [item];
					} else {
						last_item.alternatives.push(item);
					}
				} else {
					errors.push(new ParseError(lineNum, ParseErrorType.AlternativeWithoutMainItem));
				}
			}
		} else if (line.trim() === '') {
			continue;
		} else {
			errors.push(new ParseError(lineNum, ParseErrorType.WrongFormat));
		}
	}

    return { recipe: new Recipe(portions, items), errors: errors }
}