<script lang="ts">
	import { SquareMinus } from "lucide-svelte";
	import { ItemEntry } from "../../types";

	export let item: ItemEntry;
	export let removeItem: (item: ItemEntry) => void;

	let name: string = item.item.name;
	let amount: string =
		item.item.amount == null ? "" : item.item.amount.toString();

	$: item.item.name = name;
	$: item.item.amount = amount == "" ? null : amount;
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
		bind:value={name}
		placeholder="Name"
	/>
	<input
		type="text"
		class="item-entry-input"
		bind:value={amount}
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
		border-radius: var(--radius-s);
		gap: var(--size-2-2);
		padding: var(--size-2-3) var(--size-4-3);
		margin: var(--size-4-2);
	}
	.item-detail:hover {
		background: var(--background-modifier-hover);
	}

	.item-entry-input {
		background: transparent;
		border: none;
		font-size: var(--font-text-size);
		font-weight: var(--font-normal);
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
		font-size: var(--icon-l);
		cursor: pointer;
		padding: 0;
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.3s ease;
	}

	.button:hover {
		color: var(--interactive-accent-hover);
	}
</style>
