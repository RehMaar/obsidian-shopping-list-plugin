import { Amount, type AmountType, RecordedItem, RawItem, Ratio, RecipeLink } from "../types";
import { ParseRecordError, ParseErrorType } from "./types";

export function parsePortions(line: string): number {
	var result = 1;
	var param_line = line.slice(1).trim().split(' ');
	if (param_line[0].toLowerCase() === 'portions') {
		result = parseInt(param_line[1]);
		if (isNaN(result)) {
			console.log("Portions is not a number, pal");
			// TODO: error handling
			return 1;
		}
	}
	return result;
}

export function parseAmountType(str: string): AmountType | null {
	if (str.match(/^\d+\/\d+$/)) {
		var ratio_parts = str.split('/');
		return new Ratio(parseInt(ratio_parts[0]), parseInt(ratio_parts[1]));
	} else if (!isNaN(Number(str))) {
		return parseFloat(str);
	}
    return null;
}

export function parseAmount(amount_str: string): Amount  | string | null {
	amount_str = amount_str.trim();
    if (amount_str.length == 0) {
        return null;
    }
	let separator_index = amount_str.indexOf(' ');

	let amount_part = separator_index === -1 ? amount_str.trim() : amount_str.slice(0, separator_index).trim();
	let unit_part = separator_index === -1 ? null : amount_str.slice(separator_index + 1).trim();

    let amount = parseAmountType(amount_part);
	if (amount) {
        return new Amount(amount, unit_part);
	} else {
		return amount_str.trim();
	}
}

// Format: [[Link(|Linkname)?]]
function tryParseWikilink(line: string): {link: string, name: string | null } | null {
    let matcher = line.trim().match(/^\[\[(.*)\]\]/);
    if (matcher) {
        let linkName = null;
        let link = matcher[1];
        let splitter_index = link.indexOf('|');
        if (splitter_index != -1) {
            linkName = link.slice(splitter_index + 1);
            link = link.slice(0, splitter_index);
        }
        return { link: link, name: linkName};
    }

    return null;
}

// Format: [linkname](link)
function tryParseMarkdownLinks(line: string): { link: string, name: string } | null {
    let matcher = line.trim().match(/^\[(.+)\]\((.+)\)$/);
    if (matcher) {
        let linkName = matcher[1];
        let link = matcher[2];
        return { link: link, name: linkName };
    }
    return null;
}

export function parseLink(line: string): { link: string, name: string | null } | null {
    let wikilink = tryParseWikilink(line);
    if (wikilink) {
        return wikilink;
    }
    return tryParseMarkdownLinks(line);
}

// `<recipe link>, <portions: 1 or 1/2> 
export function parseRecipeLink(name: string, amount: string | null): RecipeLink | ParseRecordError | null {
    let link = parseLink(name);
    if (link) {
        let portions: AmountType = 1;
        if (amount) {
            let result = parseAmountType(amount);
            if (result) {
                portions = result;
            } else {
                return new ParseRecordError(ParseErrorType.WrongPortionsFormat);
            }
        }
        return new RecipeLink(link.link, link.name, portions);
    }
    return null;
}

// 
// `(-|*) <ingredient name>, <amount> <amount measurement> #<comment>`
// OR
// `(-|*) <recipe link>, <portions> #<comment>
//
export function parseRecordedItem(line: string): RecordedItem | ParseRecordError {
    // In case there are no itemizer
    if (!line.startsWith('*') && !line.startsWith('-')) {
        return new ParseRecordError(ParseErrorType.WrongFormat);
    }
    var should_be_bought = line.startsWith('-');

    line = line.slice(1).trim();
	var comment = null;
	// find the last # in the line, if any
	var last_hash_index = line.lastIndexOf('#');
	if (last_hash_index === -1) {
		last_hash_index = line.length;
	} else {
		comment = line.slice(last_hash_index + 1).trim();
        if (comment == "") {
            comment = null;
        }
	}
	var line_without_comment = line.slice(0, last_hash_index);
    var name = line_without_comment.trim();
    var amount_str = null;
	var amount_index = line_without_comment.lastIndexOf(',');
    if (amount_index != -1) {
	    name = line_without_comment.slice(0, amount_index).trim();
        amount_str = line_without_comment.slice(amount_index + 1).trim();
    }

    var item = null;
    let result = parseRecipeLink(name, amount_str);
    if (result) {
        if (result instanceof ParseRecordError) {
            return result;
        }
        item = result;
    } else {
        let amount = null;
        if (amount_str) {
            amount = parseAmount(amount_str);
        }
	    item = new RawItem(name, amount);
    }

	return new RecordedItem(item, should_be_bought, comment);
}