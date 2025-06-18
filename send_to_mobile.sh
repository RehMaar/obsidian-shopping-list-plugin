#!/bin/bash


npm run build && adb push manifest.json main.js styles.css /sdcard/Documents/test/.obsidian/plugins/shopping-list-plugin/
