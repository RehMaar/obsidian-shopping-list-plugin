<script lang="ts">
	import type { ItemEntry } from "src/types";

	export let parent_index;
	export let entry_index;
	export let entry;

	export let onDone: (item_entry: ItemEntry) => void;

	function toggleDone(item_entry: ItemEntry) {
		onDone(item_entry);
	}
</script>

<ul class="item-detail">
	<input
		type="checkbox"
		id={`${parent_index}-${entry.item.name}-${entry_index}`}
		checked={entry.done}
		on:change={() => toggleDone(entry)}
	/>
	<!-- <label
		for={`${parent_index}-${entry.item.name}-${entry_index}`}
		class:done={entry.done}
	> -->
	<span class="item-name">{entry.item.name}</span>
	<span class="item-amount">{entry.item.amount}</span>
	<!-- </label> -->
</ul>

<style>
	/* .item-detail {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		background: var(--background-primary-alt);
		border-radius: 4px;
		margin-bottom: 6px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: background-color 0.3s ease;
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
		font-weight: bold;
	} */
</style>
