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
		border-radius: 4px;
		gap: 8px;
		padding: 6px 12px;
		margin: 8px;
		height: 32px;
	}

	.item-detail:hover {
		background: var(--background-modifier-hover);
	}

	.item-name {
		font-size: 14px;
		color: var(--text-normal);
	}

	.item-amount {
		font-size: 14px;
		color: var(--text-muted);
		font-style: italic;
	}
</style>
