import { describe, expect, test } from '@jest/globals';
import { parseShoppingList } from '../src/shoppingItems/utils';
import { Item } from '../src/types';

describe('parsing postprocessor list', () => {
    test('simple test', () => {
        let data = `
item1:1 liter
item2:2 kg
item3:3 stk
item4`;

        let expected = [
            new Item('item1', '1 liter'),
            new Item('item2', '2 kg'),
            new Item('item3', '3 stk'),
            new Item('item4'),
        ];

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })


    test('no amounts', () => {
        let data = `
item1
item2
item3`;

        let expected = [
            new Item('item1'),
            new Item('item2'),
            new Item('item3'),
        ];

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })

    test('empty list', () => {
        let data = '';

        let expected: Item[] = [];

        let items = parseShoppingList(data);
        expect(items).toEqual(expected);
    })
})