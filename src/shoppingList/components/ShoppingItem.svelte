<script lang="ts">
	import type { ItemEntry } from "src/types";

	export let entry;

	export let onDone: (item_entry: ItemEntry) => void;

	function toggleDone(item_entry: ItemEntry) {
		onDone(item_entry);
	}
</script>

<ul class="item-detail">
	<input
		type="checkbox"
		checked={entry.done}
		on:change={() => toggleDone(entry)}
	/>
	<span class="item-name">{entry.item.name}</span>
	<span class="item-amount">{entry.item.amount}</span>
	<!-- </label> -->
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
		min-height: var(--size-4-8);
		height: auto;
		flex-wrap: wrap;
	}

	.item-detail:hover {
		background: var(--background-modifier-hover);
	}

	.item-name {
		font-size: var(--font-text-size);
		color: var(--text-normal);
		overflow-wrap: break-word;
		max-width: 60%;
	}

	.item-amount {
		font-size: var(--font-text-size);
		color: var(--text-muted);
		font-style: italic;
		overflow-wrap: break-word;
	}
</style>
