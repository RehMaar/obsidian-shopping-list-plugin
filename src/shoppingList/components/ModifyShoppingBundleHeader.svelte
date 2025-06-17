<!-- Should be in sync with ShoppingBundleHeader.svelte -->
<!-- TODO: find a way to use the same styles everywhere! -->
<script lang="ts">
	import { SquarePen, SquareX } from "lucide-svelte";

	import type { BundleEntry } from "../../types";

	export let bundle: BundleEntry;

	export let onRemove: (bundle: BundleEntry) => void;
	export let onSave: (bundle: BundleEntry) => void;
</script>

<div class="item-header">
	<input
		type="checkbox"
		checked={false}
		disabled
		tabindex="-1"
		style="pointer-events: none"
	/>
	<div class="entry-title-container">
		<input
			class="entry-title"
			type="text"
			bind:value={bundle.name}
			placeholder="Bundle name"
		/>
	</div>
	<button class="button" on:click={() => onSave(bundle)} aria-label="Save">
		<SquarePen />
	</button>
	<button
		class="button"
		on:click={() => onRemove(bundle)}
		aria-label="Remove"
	>
		<SquareX />
	</button>
</div>

<style>
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
		color: var(--text-title);
		font-size: 16px;
		font-weight: bold;
		text-align: left;
		padding: 0;
	}
	.entry-title {
		cursor: pointer;
		flex: 1 1 auto;
		font-size: 16px;
		color: var(--text-title);
		font-weight: bold;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		outline: none;
		min-width: 0;
		height: 36px;
		display: flex;
		align-items: center;
	}
	.entry-title:focus {
		outline: none;
		box-shadow: none;
	}
	.button {
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

	.button:hover {
		color: var(--interactive-accent-hover);
	}
</style>
