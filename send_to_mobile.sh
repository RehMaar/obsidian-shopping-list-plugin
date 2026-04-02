#!/bin/bash -efu

if [[ -z "$MOBILE_STORAGE" ]];
then
	echo "No MOBILE_STORAGE is set. Run source .env"
	exit 1
fi


npm run build && adb push manifest.json main.js "$MOBILE_STORAGE/.obsidian/plugins/shopping-list-plugin/"
