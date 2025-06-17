<script lang="ts">
	import { SquareCheck } from "lucide-svelte";

	import { Item } from "../../types";

	export let acceptItem: (item: Item) => void;

	let currentItemName: string = "";
	let currentItemAmount: string = "";

	function acceptItemLocal(name: string, amount: string) {
		name = name.trim();
		amount = amount.trim();

		let amount_ = amount === "" ? null : amount;

		acceptItem(new Item(name, amount_));

		currentItemName = "";
		currentItemAmount = "";
	}
</script>

<li class="item-detail add-item-entry-row">
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
		bind:value={currentItemName}
		placeholder="Name"
	/>
	{#if currentItemName.trim() !== ""}
		<input
			type="text"
			class="item-entry-input"
			bind:value={currentItemAmount}
			placeholder="Amount"
			on:keydown={(e) =>
				e.key === "Enter" &&
				acceptItemLocal(currentItemName, currentItemAmount)}
		/>
		<button
			class="button"
			on:click={() => acceptItemLocal(currentItemName, currentItemAmount)}
			aria-label="Accept item"
		>
			<SquareCheck />
		</button>
	{/if}
</li>

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
