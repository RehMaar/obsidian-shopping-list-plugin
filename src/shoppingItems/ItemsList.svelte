<script lang="ts">
	import { ClipboardPlus } from "lucide-svelte";

	import store from "../store";
	import type ShoppingListPlugin from "../main";
	import { type Item } from "../types";

	export let items: Array<Item>;
	let plugin: ShoppingListPlugin;
	store.plugin.subscribe((p) => (plugin = p));

	function copyToFile() {
		if (!plugin) {
			console.error("Plugin is not initialized.");
			return;
		}
		plugin.copyToFile(items);
	}
</script>

<div class="list-container">
	<header class="list-header">
		<button
			class="button"
			on:click={copyToFile}
			aria-label="Copy to shopping list"
		>
			<ClipboardPlus /> Copy to list
		</button>
	</header>

	<div class="item-details">
		{#each items as item}
			<ul class="item-detail">
				<span class="item-name">{item.name}</span>
				<span class="item-amount">{item.amount}</span>
			</ul>
		{/each}
	</div>
</div>

<style>
	.button {
		background: none;
		border: none;
		padding: var(--size-2-2);
		margin: 0;
		box-shadow: none;
		outline: none;
		color: var(--interactive-accent);
		cursor: pointer;
		margin-right: auto;
		font-size: var(--icon-l);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.3s ease;
	}

	.button:hover {
		color: var(--interactive-accent-hover);
	}

	.list-container {
		background: var(--background-secondary);
		border-radius: var(--radius-m);
		box-shadow: 0 var(--size-2-1) var(--size-2-2) rgba(0, 0, 0, 0.1);
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.item-detail {
		display: flex;
		background: var(--background-primary-alt);
		align-items: center;
		transition: background-color 0.3s ease;
		border-radius: var(--radius-s);
		gap: var(--size-2-2);
		padding: var(--size-2-3) var(--size-4-3);
		margin: var(--size-4-2);
		height: var(--size-4-8);
	}

	.item-detail:hover {
		background: var(--background-modifier-hover);
	}

	.item-name {
		font-size: var(--font-text-size);
		color: var(--text-normal);
	}

	.item-amount {
		font-size: var(--font-text-size);
		color: var(--text-muted);
		font-style: italic;
	}
</style>
