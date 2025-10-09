export interface ShoppingPluginSettings {
    shoppingListDir: string;
    defaultShoppingListFileName: string;
    showShoppingListRibbon: boolean;
    fileExtension: string;
}

export const DEFAULT_SETTINGS: ShoppingPluginSettings = {
    shoppingListDir: '/',
    defaultShoppingListFileName: 'ShoppingList',
    showShoppingListRibbon: true,
    fileExtension: 'shpl'
}


