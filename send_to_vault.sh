#!/bin/bash -efu

TARGET_VAULT=$1
PLUGIN_NAME="shopping-list-plugin"

if [[ ! -d "$TARGET_VAULT" ]];
then
    echo "Target vault $TARGET_VAULT isn't a directory or doesn't exist"
    exit 1
fi

TARGET_VAULT_FULL=$(readlink -f "$TARGET_VAULT")

PLUGIN_DIR="$TARGET_VAULT_FULL/.obsidian/plugins"

if [[ ! -d "$PLUGIN_DIR" ]];
then
    echo "Plugin directory doesn't exist. Allow the community plugins in the Obsidian settings"
    exit 1
fi

TARGET_DIR="$PLUGIN_DIR/$PLUGIN_NAME"

    echo "Coping plugin to $TARGET_DIR"
if [[ ! -d "$TARGET_DIR" ]];
then
    mkdir -p "$TARGET_DIR"
    echo "You should manually add this plugin to your 'community-plugins.json' if you copy this plugin for the first time"
else
    echo "Coping plugin to $TARGET_DIR"
fi


npm run build && cp main.js styles.css manifest.json "$TARGET_DIR"
