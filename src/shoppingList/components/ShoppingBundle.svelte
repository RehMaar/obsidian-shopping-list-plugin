<script lang="ts">
	import type { BundleEntry } from "src/types";
	import ShoppingListItem from "./ShoppingItem.svelte";
	import { SquareX } from "lucide-svelte";

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
</script>

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
		<div
			class="remove-button"
			on:click={() => removeBundle(bundle)}
			on:keydown={(e) => e.key === "Enter" && removeBundle(bundle)}
			aria-label="Remove bundle"
			role="button"
			tabindex="0"
		>
			<SquareX />
		</div>
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

<style>
	.shopping-list-item {
		background: var(--background-secondary);
		border-radius: 6px;
		padding: 12px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.shopping-list-item:hover {
		background: var(--background-modifier-hover);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
		flex: 1 1 auto;
	}

	/* Title Div Styles */
	.entry-title {
		cursor: pointer;
		color: var(--text-title);
		font-size: 16px;
		font-weight: bold;
		text-align: left;
		padding: 0;
	}

	.remove-button {
		background: none;
		border: none;
		color: var(--interactive-accent);
		font-size: 18px;
		cursor: pointer;
		padding: 0;
		margin-left: auto; /* Push the button to the far right */
		width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.3s ease;
	}

	.remove-button:hover {
		color: var(--interactive-accent-hover);
	}
	/* Inner List Styles */
	.item-details {
		list-style: none;
		padding: 0;
		margin: 12px 0 0;
	}
</style>
