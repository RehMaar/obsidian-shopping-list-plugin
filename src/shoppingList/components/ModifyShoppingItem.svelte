<script lang="ts">
	import { SquareMinus } from "lucide-svelte";
	import { ItemEntry } from "../../types";

	export let item: ItemEntry;
	export let removeItem: (item: ItemEntry) => void;
</script>

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
		class="item-entry-input"
		bind:value={item.item.name}
		placeholder="Name"
	/>
	<input
		type="text"
		class="item-entry-input"
		bind:value={item.item.amount}
		placeholder="Amount"
	/>
	<button
		class="button"
		on:click={() => removeItem(item)}
		aria-label="Remove item"
	>
		<SquareMinus />
	</button>
</ul>

<style>
	.item-detail {
		display: flex;
		background: var(--background-primary-alt);
		align-items: center;
		transition: background-color 0.3s ease;
		border-radius: 4px;
		gap: 8px;
		padding: 6px 12px;
		margin: 8px;
		height: 32px;
	}
	.item-detail:hover {
		background: var(--background-modifier-hover);
	}

	.item-entry-input {
		background: transparent;
		border: none;
		font-size: 14px;
		font-weight: normal;
		color: var(--text-normal);
		padding: 0;
		margin: 0;
		min-width: 0;
		outline: none;
		flex: 1 1 0;
	}

	.item-entry-input:focus {
		background: transparent;
		border: none;
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
