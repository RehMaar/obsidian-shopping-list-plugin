<script lang="ts">
	import { SquarePlus } from "lucide-svelte";
	import { BundleEntry, Item, ItemEntry } from "../../types";

	import AddShoppingBundleHeader from "./AddShoppingBundleHeader.svelte";
	import AddShoppingItem from "./AddShoppingItem.svelte";
	import ModifyShoppingItem from "./ModifyShoppingItem.svelte";

	export let onFinish: (bundle: BundleEntry) => void;

	let showAddBundleInput = false;
	let newBundleName = "";
	let addingBundle = false; // true after bundle name is accepted

	let newItems: ItemEntry[] = [];
	let addingItem = false; // true when entering item name/amount

	function acceptBundleName(name: string) {
		if (name.trim() === "") return;
		newBundleName = name.trim();
		addingBundle = true;
		addingItem = true;
	}

	function cancelAddBundle() {
		showAddBundleInput = false;
		addingBundle = false;
		newBundleName = "";
		newItems = [];
	}

	function acceptItem(item: Item) {
		newItems = [...newItems, new ItemEntry(item)];
	}

	function removeItem(item: ItemEntry) {
		newItems = newItems.filter((n) => n !== item);
	}

	function finalizeBundle(name: string) {
		newBundleName = name.trim();
		if (newBundleName === "") return;

		if (newItems.length === 0) return;
		const newBundle = new BundleEntry(newItems, newBundleName);
		onFinish(newBundle);
		cancelAddBundle();
	}
</script>

{#if !showAddBundleInput}
	<div class="add-bundle-button-row">
		<div
			class="add-button"
			on:click={() => {
				showAddBundleInput = true;
			}}
			on:keydown={(e) => {
				if (e.key === "Enter") {
					showAddBundleInput = true;
				}
			}}
			aria-label="Add bundle"
			role="button"
			tabindex="0"
		>
			<SquarePlus />
		</div>
	</div>
{:else if !addingBundle}
	<div class="shopping-list-item add-bundle-row">
		<!-- Input for the bundle name -->
		<AddShoppingBundleHeader
			{newBundleName}
			{acceptBundleName}
			{cancelAddBundle}
			{finalizeBundle}
			isCreating={true}
		/>
	</div>
{:else}
	<div class="shopping-list-item add-bundle-row">
		<!-- After bundle name is accepted, show item entry UI -->
		<AddShoppingBundleHeader
			{newBundleName}
			{acceptBundleName}
			{cancelAddBundle}
			{finalizeBundle}
			isCreating={false}
		/>

		<ul class="item-details">
			{#each newItems as item}
				<ModifyShoppingItem {item} {removeItem} />
			{/each}
			<!-- New item input row -->
			<AddShoppingItem {acceptItem} />
		</ul>
	</div>
{/if}

<style>
	.add-bundle-button-row {
		margin-left: 4px;
	}

	.shopping-list-item {
		background: var(--background-secondary);
		border-radius: 6px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		padding-left: 6px;
		padding-right: 6px;
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
		margin-bottom: 12px;
	}

	.shopping-list-item:hover {
		background: var(--background-modifier-hover);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}
	.item-details {
		list-style: none;
		padding: 0;
		margin: 0px;
		padding-bottom: 6px;
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
		margin-left: 0px;
	}

	.add-button:hover {
		color: var(--interactive-accent-hover);
	}
</style>
