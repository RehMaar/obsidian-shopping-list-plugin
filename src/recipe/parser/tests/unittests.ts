import { describe, expect, test } from '@jest/globals';
import { parseAmount, parseRecordedItem, tryParseLink } from '../inner';
import { parse } from '../parser';
import { Amount, Ratio, RawItem, Recipe, RecipeLink, RecipeRecord, RecordedItem } from '../../types';
import { ParseError, ParseRecordError } from '../types';

describe('parsing link', () => {
    test('parse wikilinks', () => {
        expect(tryParseLink("[[Test]]")).toEqual({ result: {link: "Test", name: null}, rest: ""});
        expect(tryParseLink("[[^Test]]")).toEqual({ result: {link: "^Test", name: null}, rest: ""});
        expect(tryParseLink("[[Test|TestName]]")).toEqual({ result: {link: "Test", name: "TestName"}, rest: ""});
        expect(tryParseLink("[[Test|TestName#Name]]")).toEqual({ result: {link: "Test", name: "TestName#Name"}, rest: ""});
        expect(tryParseLink("[[Test#Section|TestName]]")).toEqual({ result: {link: "Test#Section", name: "TestName"}, rest: ""});
        expect(tryParseLink("[[Untitled/Test Note#^ff2a77]]")).toEqual({ result: {link: "Untitled/Test Note#^ff2a77", name: null}, rest: ""});
    });

    test('parse markdown links', () => {
        expect(tryParseLink("[Linkname](Link)")).toEqual({ result: {link: "Link", name: "Linkname"}, rest: ""});
        expect(tryParseLink("[Linkname](Link#Section)")).toEqual({ result: {link: "Link#Section", name: "Linkname"}, rest: ""});
        expect(tryParseLink("[TD](TODO(hello))")).toEqual({ result: {link: "TODO(hello)", name: "TD"}, rest: ""});
        expect(tryParseLink("[TD]([TODO|(hello)])")).toEqual({ result: {link: "[TODO|(hello)]", name: "TD"}, rest: ""});
    });
});

describe('parsing amount', () => {
    test('parse pcs', () => {
        expect(parseAmount("1 pcs"))
         .toEqual(new Amount(1, "pcs"));
        expect(parseAmount("102 pcs"))
         .toEqual(new Amount(102, "pcs"));
        expect(parseAmount("2.5 pcs"))
         .toEqual(new Amount(2.5, "pcs"));
        expect(parseAmount("1/2 pcs"))
         .toEqual(new Amount(new Ratio(1, 2), "pcs"));
    });

    test('parse l', () => {
        expect(parseAmount("1 l"))
         .toEqual(new Amount(1, "l"));
        expect(parseAmount("102 l"))
         .toEqual(new Amount(102, "l"));
        expect(parseAmount("2.5 l"))
         .toEqual(new Amount(2.5, "l"));
        expect(parseAmount("1/2 l"))
         .toEqual(new Amount(new Ratio(1, 2), "l"));
    });


    test('parse any unit really', () => {
        expect(parseAmount("1 haha"))
         .toEqual(new Amount(1, "haha"));
        expect(parseAmount("102 could it be"))
         .toEqual(new Amount(102, "could it be"));
        expect(parseAmount("2.5 #papaya"))
         .toEqual(new Amount(2.5, "#papaya"));
        expect(parseAmount("1/2 #papaya"))
         .toEqual(new Amount(new Ratio(1, 2), "#papaya"));
    });

    test('parse no unit', () => {
        expect(parseAmount("1"))
         .toEqual(new Amount(1));
        expect(parseAmount("102"))
         .toEqual(new Amount(102));
        expect(parseAmount("2.5"))
         .toEqual(new Amount(2.5));
        expect(parseAmount("1/2"))
         .toEqual(new Amount(new Ratio(1, 2)));
    });

    test('parse invalid amount', () => {
        expect(parseAmount("haha"))
         .toEqual("haha");
        expect(parseAmount("could it be"))
         .toEqual("could it be");
        expect(parseAmount("#papaya"))
         .toEqual("#papaya");
        expect(parseAmount("1/2/3"))
         .toEqual("1/2/3");
        expect(parseAmount("1_000,32"))
         .toEqual("1_000,32");
    });
});

describe('parsing record', () => {
    test("simple record", () => {
        expect(parseRecordedItem("- Onion, 1 pcs"))
         .toEqual(new RecordedItem(
            new RawItem("Onion", new Amount(1, "pcs")), true));
        expect(parseRecordedItem("- Vollmilch from Edeka, 1 l"))
         .toEqual(new RecordedItem(
            new RawItem("Vollmilch from Edeka", new Amount(1, "l")), true));
        expect(parseRecordedItem("* Vollmilch from my cow, 1"))
         .toEqual(new RecordedItem(
            new RawItem("Vollmilch from my cow", new Amount(1)), false));
    })

    test("record with comment", () => {
        expect(parseRecordedItem("- Onion, 1 pcs #average size"))
         .toEqual(new RecordedItem(
            new RawItem("Onion", new Amount(1, "pcs")), true, "average size"));
        expect(parseRecordedItem("* Onion, not big # get me now, 1 pcs # what size again?"))
         .toEqual(new RecordedItem(
            new RawItem("Onion, not big # get me now", new Amount(1, "pcs")), false, "what size again?"));
        // TODO: do we want this behavior?
        expect(parseRecordedItem("* Onion #notme, 1/2 pcs #"))
         .toEqual(new RecordedItem(
            new RawItem("Onion #notme", new Amount(new Ratio(1, 2), "pcs")), false, null));
    });

    test("test record with invalid amount", () => {
        expect(parseRecordedItem("- Onion, haha"))
         .toEqual(new RecordedItem(
            new RawItem("Onion", "haha"), true));
    });

    test("test record with no amount", () => {
        expect(parseRecordedItem("- Onion"))
         .toEqual(new RecordedItem(
            new RawItem("Onion", null), true));
    });

    test("test record with no amount but comment", () => {
        expect(parseRecordedItem("- Onion #average size"))
         .toEqual(new RecordedItem(
            new RawItem("Onion", null), true, "average size"));
    });

    test("test record with no amount but comment and comma", () => {
        expect(parseRecordedItem("- Onion, #average size"))
         .toEqual(new RecordedItem(
            new RawItem("Onion", null), true, "average size"));
    });

    test("test random sentence in record", () => {
        expect(parseRecordedItem("- a random string haha"))
         .toEqual(new RecordedItem(
            new RawItem("a random string haha"), true));
    });

    test("test records with wikilinks", () => {
        expect(parseRecordedItem("- [[Test]]"))
            .toEqual(new RecordedItem(
                new RecipeLink("Test", null, 1), 
                true
            ));
        expect(parseRecordedItem("- [[Test|Linkname]]"))
            .toEqual(new RecordedItem(
                new RecipeLink("Test", "Linkname", 1), 
                true
            ));
        expect(parseRecordedItem("- [[Test|Linkname]], 2"))
            .toEqual(new RecordedItem(
                new RecipeLink("Test", "Linkname", 2), 
                true
            ));
        expect(parseRecordedItem("- [[Test|Linkname]], 1/2"))
            .toEqual(new RecordedItem(
                new RecipeLink("Test", "Linkname", new Ratio(1, 2)), 
                true
            ));
        expect(parseRecordedItem("- [[Untitled/Test Note#^ff2a77]], 1"))
            .toEqual(new RecordedItem(
                new RecipeLink("Untitled/Test Note#^ff2a77", null, 1), 
                true
            ));
        expect(parseRecordedItem("- [[Untitled/Test Note#^ff2a77]], 1 #the more the better"))
            .toEqual(new RecordedItem(
                new RecipeLink("Untitled/Test Note#^ff2a77", null, 1), 
                true,
                "the more the better"
            ));
    });
    
    test("test records with markdown links", () => {
        expect(parseRecordedItem("- [Testname](Test)"))
            .toEqual(new RecordedItem(
                new RecipeLink("Test", "Testname", 1), 
                true
            ));
        expect(parseRecordedItem("- [Linkname](Test), 2"))
            .toEqual(new RecordedItem(
                new RecipeLink("Test", "Linkname", 2), 
                true
            ));
        expect(parseRecordedItem("- [Linkname](Test), 1/2"))
            .toEqual(new RecordedItem(
                new RecipeLink("Test", "Linkname", new Ratio(1, 2)), 
                true
            ));
    });

    test("test broken record", () => {
        let result = parseRecordedItem("not a record lol");
        expect(result).toBeInstanceOf(ParseRecordError);
    });
});

describe('parsing recipe', () => {
    test("simpliest recipe", () => {
        var text = `- Onion, 1 pcs
* Water, 1 l
`;
        
        let expected = { recipe: new Recipe(1, [
            new RecipeRecord(
                new RecordedItem(new RawItem("Onion", new Amount(1, "pcs")), true), null
            ),
            new RecipeRecord(
                new RecordedItem(new RawItem("Water", new Amount(1, "l")), false), null
            )
        ]), errors: [] };

        expect(parse(text)).toEqual(expected);
    });

    test("portioned recipe", () => {
        var text = `#Portions 3
- Onion, 1 pcs
* Water, 1 l
`;
        
        let expected = { recipe: new Recipe(3, [
            new RecipeRecord(
                new RecordedItem(new RawItem("Onion", new Amount(1, "pcs")), true), null
            ),
            new RecipeRecord(
                new RecordedItem(new RawItem("Water", new Amount(1, "l")), false), null
            )
        ]), errors: [] };

        expect(parse(text)).toEqual(expected);
    });

    test("recipe with alternatives", () => {
        var text = `#Portions 3
- Onion, 1 pcs
  - Shallot, 1 pcs
  - Red onion, 2 pcs
* Water, 1 l
`;
        
        let expected = { recipe: new Recipe(3, [
            new RecipeRecord(
                new RecordedItem(new RawItem("Onion", new Amount(1, "pcs")), true), 
                [new RecordedItem(new RawItem("Shallot", new Amount(1, "pcs")), true), 
                 new RecordedItem(new RawItem("Red onion", new Amount(2, "pcs")), true)]
            ),
            new RecipeRecord(
                new RecordedItem(new RawItem("Water", new Amount(1, "l")), false)
            )
        ]), errors: [] };

        expect(parse(text)).toEqual(expected);
    });

    test("recipe with comments", () => {
        var text = `#Portions 10
- Onion, 1 pcs #average size
  - Shallot, 1 pcs #small
  - Red onion, 2 pcs #big
* Water, 1 l #from the tap
`;
        
        let expected = { recipe: new Recipe(10, [
            new RecipeRecord(
                new RecordedItem(new RawItem("Onion", new Amount(1, "pcs")), true, "average size"), 
                [new RecordedItem(new RawItem("Shallot", new Amount(1, "pcs")), true, "small"), 
                 new RecordedItem(new RawItem("Red onion", new Amount(2, "pcs")), true, "big")]
            ),
            new RecipeRecord(
                new RecordedItem(new RawItem("Water", new Amount(1, "l")), false, "from the tap")
            )
        ]), errors: [] };

        expect(parse(text)).toEqual(expected);
    });

        test("recipe with links", () => {
        var text = `#Portions 2
- Onion, 1 pcs #average size
  - Shallot, 1 pcs #small
  - Red onion, 2 pcs #big
* Water, 1 l #from the tap
- [[Pizza Dough]], 1
`;
        
        let expected = { recipe: new Recipe(2, [
            new RecipeRecord(
                new RecordedItem(new RawItem("Onion", new Amount(1, "pcs")), true, "average size"), 
                [new RecordedItem(new RawItem("Shallot", new Amount(1, "pcs")), true, "small"), 
                 new RecordedItem(new RawItem("Red onion", new Amount(2, "pcs")), true, "big")]
            ),
            new RecipeRecord(
                new RecordedItem(new RawItem("Water", new Amount(1, "l")), false, "from the tap")
            ),
            new RecipeRecord(
                new RecordedItem(new RecipeLink("Pizza Dough", null, 1), true)
            )
        ]), errors: [] };

        expect(parse(text)).toEqual(expected);
    });

    test("broken recipe", () => {
        let text = `there was a time
when men were kind
`;
        let result = parse(text);
        expect(result.errors.length).toBeGreaterThan(0);
    });

});