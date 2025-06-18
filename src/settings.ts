export interface ShoppingPluginSettings {
    shoppingListDir: string;
    defaultShoppingListFileName: string;
}

export const DEFAULT_SETTINGS: ShoppingPluginSettings = {
    shoppingListDir: '/',
    defaultShoppingListFileName: 'ShoppingList',
}


