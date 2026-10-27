# Grand New Shopping List Design

The previous iteration was a test-drive for Obsidian plugin-making. The time has come to redo everything form scratch and create an even more usable solution.


# Requirements

The shopping list interaction consists of two separate workflows:
- Storing and choosing recipies to cook at home.
- Buying items at a shop.

The interaction comes during the "Choosing" stage, where we click what we want to cook beforehand, but overall process is different and the interaction is different and requires different design.

## Ingredient List Design

A recipe file can be used as a storage for an ingredient list or also contain the whole recipe. It means that the format should look good and do not distruct from the process of cooking.

Goals:
- Keep the note with the recipe **simple** and allow any format of the file users want.
- At the same time, add nice interface to interact with the list easily
- Make it easy to add the recipe to the shopping list.

Wishlist:
- The ingredient list should contain the name of the product and the required amount.
- Recipe can contain different sub-recipes. For those I want to keep separate ingredient lists, even in the same file.
- Add referece to the recipes from other files (or the same file!) to the ingredient list (for example, for souces).
- Add the whole recipe with one click (including sub-recipes).
- Control the amount of portions we add to the shopping list.
- Easy UI for creating the list.


## Shopping List Design

With the shopping list we interact at a shop.

Goals:
- Easy navigatation in the list.
- How much we need to buy, for what recipe (may affect the quality of an item, for example), and in what amount.

Wishlist:
- Sort the items by the store section to optimize the store browsing.
- Sort the items so that they can be shared between recipes (a litre of milk for two recipes, for example).
- Undo an accidental change (marked done, when it's not)
- Keep the list easily readable.
- Add an interface to add items that are not a part of a recipe.


# Detailed Design

## Ingredient List

### What Obsidian can

#### Links

Reference: https://obsidian.md/help/links

Obisdian can reference:
- A heading in the same file:
  A heading with `[[#heading]]`. Note that it can be any heading (H1, H2, and so on). It can also be `[[#heading#subheading]]`
- Another file:
  The whole file can be refereced with `[[filename]]`.
- A heading in another file:
  It can be refereced with `[[filename#heading]]`

To name the link we can use `|`: `[[#heading|Our name of the heading]]`.

It can also reference any blocks of text with `[[^block]]`. This also works with the blocks with postprocessors.

Note that in the postprocessor blocks the links aren't formatted, we need to do it manually in the postprocessor view code.

Also, the links can be written in different formats.
Wikilink format:
```
    [[Example|Custom name]] appears as Custom name
    [[Example#Details|Section name]] appears as Section name
```

Markdown format (also looks like here we NEED to fill both `[linkname]` and `(link)`):
```
    [Custom name](Example.md) appears as Custom name
    [Section name](Example.md#Details) appears as Section name
```

The exact format is chosen in the settings.

There is an unpleasant thing with the wikilinks:
- Create a note `A` in directory `B`
- Make a link to a block to the note `A`
- Create a note `A` in directory `C`
- Obsidian asks if it should update the links.

Questions:
1. Does Obsidian tracks changes in links?
2. How make it follow the link in the postprocessor blocks? Do we need it?

Obisdian API that parses the Wikilinks. It seems we need to understand ourselves which format is used: Wikilink or Markdown.
```typescript
/*
 * Parses the linktext of a wikilink into its component parts.
 * @param linktext A wikilink without the leading [[ and trailing ]].
 * @returns The file path and subpath (subpath can refer either to a block id, or a heading).
 * @example
 * ```ts
 * console.log(parseLinktext('foo')); // { path: 'foo', subpath: '' }
 * console.log(parseLinktext('foo#bar')); // { path: 'foo', subpath: '#bar' }
 * ```
 * @public
 */
export function parseLinktext(linktext: string): {
    /**
     * @public
     */
    path: string;
    /**
     * @public
     */
    subpath: string;
};

/*
 * @param linktext A wikilink without the leading [[ and trailing ]].
 * @returns The name of the file that is being linked to.
 * @example
 * ```ts
 * console.log(getLinkpath('foo#bar')); // foo
 * ```
 */
export function getLinkpath(linktext: string): string;
```

### The Format

Since we can reference blocks of texts, headings and so on, we can leave the old format of the list or slightly modify it.
```
#Portions 2
- Ingredient 1, <amount> <amount measurement> #comment
  - Possible substitution 1, <amount> <amount measurement>
  - Possible substitution 2, <amount> <amount measurement>
- Ingredient 2
- [[^^block|Complex Ingredient 3]], <number of portions>
* Ingredient 3 #comment
```

1. `#Portions` can be omitted. Default portions is 1. The format `#Portions \d+`.
2. The item format: `- <ingredient name>(, <number> <predefined measurement>)?`. The amount and measurement can be omitted. By default, it would mean 1 piece.
3. It is also possible to set the alternative list for an item with the indentation after the item. The format is the same. Should it be one word or a sentence until the end of the line?
4. The links should be written in the Wikilink format (will it resolve in the plugin code if it's disabled in the editor?) and you can only set the amont of portions of this recipe. It can be omitted, by default it's 1 portion. The format: `- [[^^blocklink|name]](, <number>)?`. `blocklink` is a number generated by Obsidian, so it's better when the user sets the name for the item.
5. `*` means that the ingredient shouldn't be added to the shopping list. For ingredients like 'water' or 'salt'.
6. Note that we do not state the type of the item here, because the type is important for the shopping list, not for a recipe.


Examples:
```
#portions 2
- Milk, 1l
- White bread, 150 gr
- Creme Fresh 10%, 150-200gr by taste
- "Hello Paprika", 5gr
  - Simple spicy Paprika, 5 gr
* Water, 140ml
* Salt, 1 pinch
- Onion, 1/2 pcs #average size
- [[Pancakes#^c1234]], 1
```

### Type detection

## Shopping List

This file is used only for the purpose of buying items, so we can do anything with its format and view.
