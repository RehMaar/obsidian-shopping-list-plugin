<script lang="ts">
	import type { BundleEntry, ItemEntry } from "src/types";
	import ShoppingListItem from "./ShoppingItem.svelte";
	import ModifyShoppingBundle from "./ModifyShoppingBundle.svelte";
	import ShoppingBundleHeader from "./ShoppingBundleHeader.svelte";

	export let onDone: (bundle: BundleEntry) => void;
	export let onFold: (bundle: BundleEntry) => void;
	export let onRemove: (bundle: BundleEntry) => void;
	export let onItemDone: (itemEntry: ItemEntry) => void;

	export let bundle;

	function toggleDone(bundle: BundleEntry) {
		onDone(bundle);
	}

	function toggleFold(bundle: BundleEntry) {
		onFold(bundle);
	}

	function removeBundle(bundle: BundleEntry) {
		onRemove(bundle);
	}

	function toggleItemDone(itemEntry: ItemEntry) {
		onItemDone(itemEntry);
	}

	let modifyingBundle = false;

	function modifyBundle(bundle: BundleEntry) {
		// This function can be used to open a modal for renaming the bundle
		// For now, it just logs the bundle name
		console.log("Modify bundle:", bundle.name);
		modifyingBundle = true;
	}

	function stopModifing() {
		modifyingBundle = false;
	}
</script>

<div class="shopping-list-item">
	{#if modifyingBundle}
		<ModifyShoppingBundle
			{bundle}
			onSave={(_updatedBundle) => {
				stopModifing();
			}}
			onRemove={removeBundle}
		/>
	{:else}
		<ShoppingBundleHeader
			{bundle}
			{toggleDone}
			{toggleFold}
			onModify={modifyBundle}
		/>

		<!-- Inner List -->
		{#if !bundle.folded}
			<ul class="item-details">
				{#each bundle.items as entry, entry_index}
					<ShoppingListItem {entry} onDone={toggleItemDone} />
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style>
	.shopping-list-item {
		background: var(--background-secondary);
		border-radius: var(--radius-m);
		box-shadow: 0 var(--size-2-1) var(--size-2-2) rgba(0, 0, 0, 0.1);
		padding-left: var(--size-2-3);
		padding-right: var(--size-2-3);
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
		margin-bottom: var(--size-4-3);
	}

	.shopping-list-item:hover {
		background: var(--background-modifier-hover);
		box-shadow: 0 var(--size-2-1) var(--size-2-3) rgba(0, 0, 0, 0.2);
	}
	.item-details {
		list-style: none;
		padding: 0;
		padding-bottom: var(--size-2-3);
		margin: 0px;
	}
</style>
