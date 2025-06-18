<script lang="ts">
	import { ClipboardPlus } from "lucide-svelte";
	import { Notice } from "obsidian";

	import store from "../store";
	import type ShoppingListPlugin from "../main";
	import { type Item, type Result, type Error } from "../types";

	export let items: Result<Item[]>;
	let plugin: ShoppingListPlugin;
	store.plugin.subscribe((p) => (plugin = p));

	function copyToFile() {
		if (!plugin) {
			console.error("Plugin is not initialized.");
			return;
		}
		if (items.success) {
			plugin.copyToFile(items.value);
		} else {
			new Notice("Unable to copy due to formatting errors.");
		}
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
		{#if !items.success}
			<span class="error-message">{items.error.message}</span>
		{:else}
			{#each items.value as item}
				<ul class="item-detail">
					<span class="item-name">{item.name}</span>
					{#if item.amount != null}
						<span class="item-amount">{item.amount}</span>
					{/if}
				</ul>
			{/each}
		{/if}
	</div>
</div>

<style>
	.error-message {
		color: var(--text-error);
		font-size: var(--font-text-size);
		padding: var(--size-2-3);
		text-align: center;
	}

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
		border-radius: var(--radius-l);
		box-shadow: 0 var(--size-2-1) var(--size-2-2) rgba(0, 0, 0, 0.1);
		padding-left: var(--size-2-3);
		padding-right: var(--size-2-3);
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
		min-height: var(--size-4-8);
		height: auto;
		flex-wrap: wrap;
	}

	.item-detail:hover {
		background: var(--background-modifier-hover);
	}

	.item-name {
		font-size: var(--font-text-size);
		color: var(--text-normal);
		overflow-wrap: break-word;
		max-width: 60%;
	}

	.item-amount {
		font-size: var(--font-text-size);
		color: var(--text-muted);
		font-style: italic;
		overflow-wrap: break-word;
	}
</style>
