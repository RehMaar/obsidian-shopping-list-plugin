<script lang="ts">
	import type { BundleEntry, ItemEntry } from "src/types";
	import ShoppingListItem from "./ShoppingItem.svelte";
	import { SquareX, SquarePen } from "lucide-svelte";
	import ModifyShoppingBundle from "./ModifyShoppingBundle.svelte";

	export let onDone: (bundle: BundleEntry) => void;
	export let onFold: (bundle: BundleEntry) => void;
	export let onRemove: (bundle: BundleEntry) => void;
	export let onItemDone: (itemEntry: ItemEntry) => void;

	export let bundle;
	export let bundle_index;

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

{#if modifyingBundle}
	<div class="shopping-list-item">
		<ModifyShoppingBundle
			{bundle}
			onSave={(_updatedBundle) => {
				stopModifing();
			}}
		/>
	</div>
{:else}
	<div class="shopping-list-item">
		<div class="item-header">
			<!-- Checkbox for marking the entry as done -->
			<input
				type="checkbox"
				id={`${bundle.name}-${bundle_index}`}
				checked={bundle.done}
				on:change={() => toggleDone(bundle)}
			/>
			<!-- I've no idea what's ARIA role and tabindex, so it may backfire someday -->
			<div
				class="entry-title-container"
				role="button"
				tabindex="0"
				on:click={() => toggleFold(bundle)}
				on:keydown={(e) => e.key === "Enter" && toggleFold(bundle)}
				aria-label={bundle.folded ? "Expand bundle" : "Collapse bundle"}
			>
				<span class="entry-title">{bundle.name}</span>
			</div>
			<button
				class="modify-button"
				on:click={() => modifyBundle(bundle)}
				aria-label="Rename"
			>
				<SquarePen />
			</button>
			<button
				class="remove-button"
				on:click={() => removeBundle(bundle)}
				aria-label="Remove bundle"
			>
				<SquareX />
			</button>
		</div>

		<!-- Inner List -->
		{#if !bundle.folded}
			<ul class="item-details">
				{#each bundle.items as entry, entry_index}
					<ShoppingListItem
						parent_index={bundle_index}
						{entry_index}
						{entry}
						onDone={toggleItemDone}
					/>
				{/each}
			</ul>
		{/if}
	</div>
{/if}

<style>
	.shopping-list-item {
		background: var(--background-secondary);
		border-radius: 6px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		padding: 0;
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
		margin-bottom: 12px;
	}

	.shopping-list-item:last-child {
		margin-bottom: 0;
	}

	.shopping-list-item:hover {
		background: var(--background-modifier-hover);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}
	.item-details {
		list-style: none;
		padding: 0;
		margin: 0px;
	}
	.item-header {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		font-weight: bold;
		color: var(--text-title);
	}

	.entry-title-container {
		cursor: pointer;
		transition: background 0.2s;
		border: none;
		flex: 1 1 auto;
		color: var(--text-title);
		font-size: 16px;
		font-weight: bold;
		text-align: left;
		padding: 0;
		height: 36px;
		display: flex;
		align-items: center;
	}

	.modify-button,
	.remove-button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		box-shadow: none;
		outline: none;
		color: var(--interactive-accent);
		font-size: 22px;
		cursor: pointer;
		padding: 0;
		margin-left: auto;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.3s ease;
	}

	/* 


	.modify-button:hover,
	.remove-button:hover {
		color: var(--interactive-accent-hover);
	} */
</style>
