# Obsidian Shopping List Plugin

This is a shopping list plugin for [Obsidian](https://obsidian.md).

With unprecedentedly easy UI you can control your shopping list and easily add new recipes and more!

![Shopping list](./images/shopping_list.png#interface)

Keep your recipes in your Obsidian vault AND add them to your shopping list by clicking just one button!

![Shopping items](./images/shopping_items.png#interface)

To create your items list, use a code block with the `shopping` key and a enter your list in a simple format:
- Use a hyphen (-) to introduce a new item in the following format: `- <Item name>`
- Use a semicolon (:) delimiter to add required amount in any format: `- <Item name>: <amount>`

That's it!

![Shopping items edit](./images/shopping_items_edit.png#interface)



Need quick access to the list? Just click one button on the left panel!

![Shopping ribbon](./images/shopping_ribbon.png#interface)

Need to add something manually or edit the existing items? No problem!
![Shopping list edit](./images/shopping_list_edit.png#interface)


What to change the list location or rename it? Never been so easy! Just open the settings and do what you need!

![Shopping settings](./images/settings.png#interface)


We do it, because we need it! So, new features will follow:
- Sorting by the product type
- You can propose something cool!


# How to build and copy

- `yarn install` to install all the deps
- `yarn build` to build the project

# Attribution

This plugin, as many before, was based on the template from the [plugin tutorial](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin). Thank them (and other plugins developers) very much for the chance to understand Obsidian Plugin API (which requires a lot more explanation than already provided)!