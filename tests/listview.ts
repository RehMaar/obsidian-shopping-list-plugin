import { describe, expect, test } from '@jest/globals';

import { Item, ItemEntry, BundleEntry } from '../src/types';
import { parseViewData } from '../src/shoppingList/utils';

describe('parsing postprocessor list', () => {
    test('smoky test', () => {
        let data = `
- [ ] Bundle1
    - [ ] item1: 1 liter
    - [x] item2: 2 kg
    - [ ] item3: 3 stk
    - [x] item4:
+ [x] Bundle2
    - [ ] item1
        `;
        let expected = [
            new BundleEntry([
                new ItemEntry(new Item('item1', '1 liter'), false),
                new ItemEntry(new Item('item2', '2 kg'), true),
                new ItemEntry(new Item('item3', '3 stk'), false),
                new ItemEntry(new Item('item4'), true)
            ], 'Bundle1', false, false),
            new BundleEntry([
                new ItemEntry(new Item('item1'), false)
            ], 'Bundle2', true, true)
        ];

        let bundles = parseViewData(data);
        expect(bundles).toEqual(expected);
    });

    test('one entry', () => {
        let data = `
- [ ] Bundle1
    - [ ] item1: 1 liter
    `;
        let expected = [
            new BundleEntry([
                new ItemEntry(new Item('item1', '1 liter'), false),
            ], 'Bundle1', false, false),
        ];

        let bundles = parseViewData(data);
        expect(bundles).toEqual(expected);
    });
});