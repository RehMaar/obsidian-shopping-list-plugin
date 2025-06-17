<script lang="ts">
	import { BundleEntry, Item, ItemEntry } from "../../types";
	import {
		SquareCheck,
		SquareMinus,
		SquarePen,
		SquareX,
	} from "lucide-svelte";

	export let bundle: BundleEntry;
	export let onSave: (bundle: BundleEntry) => void;

	function saveBundle() {
		if (bundle.name.trim() === "") return;
		let any_item_empty = bundle.items.filter(
			(item) => item.item.name.trim() !== "",
		).length;
		if (any_item_empty === 0) return;
		onSave(bundle);
	}

	function removeItem(item: ItemEntry) {
		bundle.items = bundle.items.filter((i) => i !== item);
	}
</script>

<div class="shopping-list-item modify-bundle-row">
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
		<button
			class="accept-button"
			on:click={saveBundle}
			aria-label="Save Bundle"
		>
			<SquarePen />
		</button>
		<button
			class="accept-button"
			on:click={saveBundle}
			aria-label="Save Bundle"
		>
			<SquareX />
		</button>
	</div>
	<ul class="item-details">
		{#each bundle.items as item}
			<ul class="item-detail">
				<input
					type="checkbox"
					checked={false}
					disabled
					tabindex="-1"
					style="pointer-events: none"
				/>
				<input
					type="text"
					class="item-entry-name-input"
					bind:value={item.item.name}
					placeholder="Item name"
				/>
				<input
					type="text"
					class="item-entry-amount-input"
					bind:value={item.item.amount}
					placeholder="Amount"
				/>
				<button
					class="remove-button"
					on:click={() => removeItem(item)}
					aria-label="Remove Item"
				>
					<SquareMinus />
				</button>
			</ul>
		{/each}
	</ul>
</div>

<style>
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
	.accept-button,
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

	.accept-button:hover,
	.remove-button:hover {
		color: var(--interactive-accent-hover);
	}
	/*
	.item-header .accept-button,
	.item-header .remove-button {
		margin-left: 0;
	}

	.item-details {
		padding-left: 0;
		margin-left: 0;
		list-style: none;
	}

	.item-entry-name-input {
		background: transparent;
		border: none;
		font-size: 16px;
		font-weight: normal;
		color: var(--text-normal);
		padding: 0;
		margin: 0;
		min-width: 0;
		box-sizing: border-box;
		outline: none;
		flex: 1 1 0;
	}

	.item-entry-name-input:focus {
		background: transparent;
		border: none;
		outline: none;
		box-shadow: none;
	}

	.item-entry-amount-input {
		background: transparent;
		border: none;
		font-size: 16px;
		color: var(--text-muted);
		padding: 0;
		margin: 0;
		width: 100px;
		box-sizing: border-box;
		outline: none;
	}

	.item-entry-amount-input:focus {
		background: transparent;
		border: none;
		outline: none;
		box-shadow: none;
	}
*/
</style>
