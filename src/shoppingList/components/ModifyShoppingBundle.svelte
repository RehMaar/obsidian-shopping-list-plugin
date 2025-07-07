<script lang="ts">
	import { SquarePlus } from "lucide-svelte";

	import { BundleEntry, ItemEntry, Item } from "../../types";

	import ModifyShoppingItem from "./ModifyShoppingItem.svelte";
	import ModifyShoppingBundleHeader from "./ModifyShoppingBundleHeader.svelte";
	import AddShoppingItem from "./AddShoppingItem.svelte";

	export let bundle: BundleEntry;
	export let onSave: (bundle: BundleEntry) => void;
	export let onRemove: (bundle: BundleEntry) => void;

	let addingNewItem = false;

	function saveBundle() {
		if (bundle.name.trim() === "") return;
		let any_item_empty = bundle.items.filter(
			(item) => item.item.name.trim() !== "",
		).length;
		// TODO: notify that we cannot save an empty item
		if (any_item_empty === 0) return;
		onSave(bundle);
	}

	function removeItem(item: ItemEntry) {
		bundle.items = bundle.items.filter((i) => i !== item);
	}

	function acceptItem(item: Item) {
		bundle.items = [...bundle.items, new ItemEntry(item)];
	}
</script>

<div class="shopping-list-item modify-bundle-row">
	<ModifyShoppingBundleHeader {bundle} onSave={saveBundle} {onRemove} />

	<ul class="item-details">
		{#each bundle.items as item}
			<ModifyShoppingItem {item} {removeItem} />
		{/each}

		{#if !addingNewItem}
			<div class="add-button-row">
				<button
					class="add-button"
					on:click={() => {
						addingNewItem = true;
					}}
					aria-label="Add item"
				>
					<SquarePlus />
				</button>
			</div>
		{:else}
			<AddShoppingItem {acceptItem} />
		{/if}
	</ul>
</div>

<style>
	.item-details {
		list-style: none;
		padding: 0;
		margin: 0px;
		padding-bottom: var(--size-2-3);
	}

	.add-button-row {
		text-align: left;
	}
	.add-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		box-shadow: none;
		outline: none;
		color: var(--interactive-accent);
		cursor: pointer;
		padding: 0;
		font-size: var(--icon-l);
		display: flex;
		transition: color 0.3s ease;
		margin-left: var(--size-4-2);
	}

	.add-button:hover {
		color: var(--interactive-accent-hover);
	}
</style>
