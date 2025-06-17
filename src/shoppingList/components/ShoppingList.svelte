<script lang="ts">
	import store from "../../store";
	import type ShoppingListPlugin from "../../main";
	import type { BundleEntry, ItemEntry } from "../../types";
	import ShoppingBundle from "./ShoppingBundle.svelte";
	import AddShoppingBundle from "./AddShoppingBundle.svelte";

	let plugin: ShoppingListPlugin;
	store.plugin.subscribe((p) => (plugin = p));

	export let entries: Array<BundleEntry>;
	export let onSave: (entries: Array<BundleEntry>) => void;

	function refreshPage() {
		entries = [...entries]; // Trigger reactivity
	}

	function addBundle(bundle: BundleEntry) {
		entries = [...entries, bundle]; // Add the new bundle to the original entries array
		refreshPage(); // Refresh the page to reflect changes
		onSave(entries); // Save the updated entries
	}

	function toggleFold(entry: BundleEntry) {
		entry.toggleFolded();

		refreshPage(); // Refresh the page to reflect changes
		onSave(entries);
	}

	function toggleDone(entry: BundleEntry) {
		console.log("Toggling done for entry:", entry);
		entry.toggleDone();
		console.log("Toggling done for entry:", entry);

		refreshPage(); // Refresh the page to reflect changes
		onSave(entries);
	}

	function toggleItemDone(itemEntry: ItemEntry) {
		itemEntry.toggleDone();

		refreshPage(); // Refresh the page to reflect changes
		onSave(entries);
	}

	function sortByItemName() {}
	function sortByBundleName() {}

	// Function to remove a bundle
	function removeBundle(entry: BundleEntry) {
		entries = entries.filter((e) => e !== entry); // Remove the bundle from the original entries array
		refreshPage(); // Refresh the page to reflect changes
		onSave(entries); // Save the updated entries
	}
</script>

<div class="shopping-list-container">
	<header class="shopping-list-header">
		<h1>Shopping List</h1>
		<div class="header-buttons">
			<button class="sort-button" on:click={sortByItemName}
				>Sort by Items</button
			>
			<button class="sort-button" on:click={sortByBundleName}
				>Sort by Bundles</button
			>
		</div>
	</header>

	<div class="shopping-list">
		{#each entries as bundle, bundle_index}
			{#if !bundle.done}
				<ShoppingBundle
					{bundle}
					{bundle_index}
					onDone={toggleDone}
					onFold={toggleFold}
					onRemove={removeBundle}
					onItemDone={toggleItemDone}
				/>
			{/if}
		{/each}
	</div>

	<AddShoppingBundle onFinish={addBundle} />

	<div class="shopping-list done-list">
		<header class="shopping-list-header">
			<h1>Shopping List Done</h1>
		</header>
		{#each entries as bundle, bundle_index}
			{#if bundle.done}
				<ShoppingBundle
					{bundle}
					{bundle_index}
					onDone={toggleDone}
					onFold={toggleFold}
					onRemove={removeBundle}
					onItemDone={toggleItemDone}
				/>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* General Styles */
	.shopping-list-container {
		background: var(--background-primary);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		width: 100%;
		max-width: 600px;
		padding: 16px;
		margin: 0 auto;
		color: var(--text-normal);
	}

	/* Header Styles */
	.shopping-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.shopping-list-header h1 {
		font-size: 20px;
		color: var(--text-title);
		margin: 0;
	}

	.header-buttons {
		display: flex;
		gap: 8px;
	}

	.sort-button {
		background-color: var(--interactive-accent);
		color: var(--text-on-accent);
		border: none;
		border-radius: 6px;
		padding: 6px 12px;
		font-size: 14px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.sort-button:hover {
		background-color: var(--interactive-accent-hover);
	}

	/* Shopping List Styles */
	.shopping-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.done-list {
		margin-top: 48px; /* Large gap before the done list */
	}
</style>
