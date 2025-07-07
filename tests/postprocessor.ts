import { describe, expect, test } from '@jest/globals';
import { parseShoppingList } from '../src/shoppingItems/utils';
import { Item, type Result, Error, ok, err } from '../src/types';

describe('parsing postprocessor list', () => {
    test('simple test', () => {
        let data = `
item1:1 liter
item2:2 kg
item3:3 stk
item4`;

        let expected = ok([
            new Item('item1', '1 liter'),
            new Item('item2', '2 kg'),
            new Item('item3', '3 stk'),
            new Item('item4'),
        ]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })

    test('no amounts', () => {
        let data = `
item1
item2
item3`;

        let expected = ok([
            new Item('item1'),
            new Item('item2'),
            new Item('item3'),
        ]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })

    test('empty list', () => {
        let data = '';

        let expected: Result<Item[]> = ok([]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })

    test('list with prefixed dashes', () => {
        let data = `
- item1:1 liter
- item2:2 kg
- item3:3 stk
- item4`;

        let expected = ok([
            new Item('item1', '1 liter'),
            new Item('item2', '2 kg'),
            new Item('item3', '3 stk'),
            new Item('item4'),
        ]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })

    test('list with prefixed asterisks', () => {
        let data = `
* item1:1 liter
* item2:2 kg
* item3:3 stk
* item4`;

        let expected = ok([
            new Item('item1', '1 liter'),
            new Item('item2', '2 kg'),
            new Item('item3', '3 stk'),
            new Item('item4'),
        ]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })

    test('list with prefixed plus', () => {
        let data = `
+ item1:1 liter
+ item2:2 kg
+ item3:3 stk
+ item4`;

        let expected = ok([
            new Item('item1', '1 liter'),
            new Item('item2', '2 kg'),
            new Item('item3', '3 stk'),
            new Item('item4'),
        ]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })

    test('list with prefixed dashes, incomplete item', () => {
        let data = `
- item1:1 liter
- item2:2 kg
- item3:3 stk
- item4
-
`;

        let expected = ok([
            new Item('item1', '1 liter'),
            new Item('item2', '2 kg'),
            new Item('item3', '3 stk'),
            new Item('item4'),
        ]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })
    test('unusual names', () => {
        let data = `
- item1:1 liter
- item2:2 kg
- item3:3 stk
- item4
item5, some text`;

        let expected = ok([
            new Item('item1', '1 liter'),
            new Item('item2', '2 kg'),
            new Item('item3', '3 stk'),
            new Item('item4'),
            new Item('item5, some text'),
        ]);

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })
})