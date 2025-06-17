<script lang="ts">
	import { SquarePlus, SquareX, SquareCheck } from "lucide-svelte";
	import { BundleEntry, Item, ItemEntry } from "../../types";

	export let onFinish: (bundle: BundleEntry) => void;

	let showAddBundleInput = false;
	let newBundleName = "";
	let addingBundle = false; // true after bundle name is accepted

	let newItems: ItemEntry[] = [];
	let currentItemName = "";
	let currentItemAmount = "";
	let addingItem = false; // true when entering item name/amount

	let amountInput: HTMLInputElement;

	function openAddBundle() {
		showAddBundleInput = true;
	}

	function closeAddBundle() {
		showAddBundleInput = false;
		newBundleName = "";
		newItems = [];
	}

	function acceptBundleName() {
		if (newBundleName.trim() === "") return;
		addingBundle = true;
		addingItem = true;
	}

	function cancelAddBundle() {
		showAddBundleInput = false;
		addingBundle = false;
		newBundleName = "";
		newItems = [];
		currentItemName = "";
		currentItemAmount = "";
	}

	function focusAmountInput() {}

	function acceptItem() {
		let itemName = currentItemName.trim();
		let itemAmountM = currentItemAmount.trim();
		let itemAmount = itemAmountM == "" ? null : itemAmountM;

		console.log(`Accepting item: '${itemName}'', '${itemAmount}'`);
		if (itemName === "") return;
		newItems = [...newItems, new ItemEntry(new Item(itemName, itemAmount))];
		console.log("New items:", newItems);
		currentItemName = "";
		currentItemAmount = "";
		setTimeout(() => {
			const inputs = document.querySelectorAll(".add-bundle-input");
			if (inputs.length) (inputs[0] as HTMLInputElement).focus();
		}, 0);
		console.log("done");
	}

	function finalizeBundle() {
		if (newItems.length === 0) return;
		const newBundle = new BundleEntry(newItems, newBundleName);
		onFinish(newBundle);
		cancelAddBundle();
	}
</script>

<div class="shopping-list-add-bundle">
	{#if !showAddBundleInput}
		<div
			class="add-button"
			on:click={() => {
				showAddBundleInput = true;
			}}
			on:keydown={(e) => {
				if (e.key === "Enter") {
					showAddBundleInput = true;
				}
			}}
			aria-label="Add bundle"
			role="button"
			tabindex="0"
		>
			<SquarePlus />
		</div>
	{:else if !addingBundle}
		<!-- Gray box, like a bundle, but with input for name -->
		<div class="shopping-list-item add-bundle-row">
			<div class="item-header">
				<!-- Accept (check) and cancel (cross) buttons on the left -->
				<input
					type="checkbox"
					checked={false}
					disabled
					tabindex="-1"
					style="pointer-events: none"
				/>
				<input
					class="entry-title add-bundle-name"
					type="text"
					bind:value={newBundleName}
					placeholder="Bundle name"
					on:keydown={(e) => e.key === "Enter" && acceptBundleName()}
				/>
				<button
					class="accept-button"
					on:click={acceptBundleName}
					aria-label="Accept"
				>
					<SquareCheck />
				</button>
				<button
					class="remove-button"
					on:click={cancelAddBundle}
					aria-label="Cancel"
				>
					<SquareX />
				</button>
			</div>
		</div>
	{:else}
		<!-- After bundle name is accepted, show item entry UI -->
		<div class="shopping-list-item add-bundle-row">
			<div class="item-header">
				<input
					type="checkbox"
					checked={false}
					disabled
					tabindex="-1"
					style="pointer-events: none"
				/>
				<span class="entry-title">{newBundleName}</span>
				<button
					class="remove-button"
					on:click={cancelAddBundle}
					aria-label="Cancel"
				>
					<SquareX />
				</button>
			</div>
			<ul class="item-details">
				{#each newItems as item}
					<li class="item-detail">
						<input
							type="checkbox"
							checked={false}
							disabled
							tabindex="-1"
							style="pointer-events: none"
						/>
						<span class="item-name">{item.item.name}</span>
						{#if item.item.amount !== null}
							<span class="item-amount">
								{item.item.amount}
							</span>
						{/if}
					</li>
				{/each}
				<!-- New item input row -->
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
						class="item-entry-name-input"
						bind:value={currentItemName}
						placeholder="Item name"
					/>
					{#if currentItemName.trim() !== ""}
						<input
							type="text"
							class="item-entry-amount-input"
							bind:value={currentItemAmount}
							placeholder="Amount"
							on:keydown={(e) =>
								e.key === "Enter" && acceptItem()}
						/>
						<button
							class="accept-button"
							on:click={acceptItem}
							aria-label="Accept"
						>
							<SquareCheck />
						</button>
					{/if}
				</li>
			</ul>
			<button
				class="add-bundle-confirm"
				on:click={finalizeBundle}
				style="margin-top:12px;"
			>
				Save Bundle
			</button>
		</div>
	{/if}
</div>

<style>
	/* Container for the add bundle area */
	.shopping-list-add-bundle {
		margin-top: 16px;
		margin-bottom: 0;
		width: 100%;
	}

	/* Add button (plus) */
	.add-button {
		background: var(--background-modifier-hover);
		color: var(--interactive-accent);
		border: none;
		border-radius: 6px;
		font-size: 28px;
		cursor: pointer;
		padding: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background 0.2s,
			color 0.2s;
		margin-bottom: 0;
	}

	.add-button:hover {
		background: var(--background-modifier-active);
		color: var(--interactive-accent-hover);
	}

	/* The gray box for adding a bundle, matches other entries */
	.add-bundle-row {
		width: 100%;
		box-sizing: border-box;
		background: var(--background-secondary);
		border-radius: 6px;
		padding: 12px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
		margin-bottom: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.add-bundle-row:hover {
		background: var(--background-modifier-hover);
	}

	.item-detail {
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
	}

	/* Header row for bundle name input or display */
	.item-header {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* Disabled checkbox for visual consistency */
	.item-header input[type="checkbox"] {
		margin-right: 8px;
	}

	/* Bundle name input: transparent, no border, looks like text */
	.add-bundle-name {
		background: transparent;
		border: none;
		font-size: 16px;
		font-weight: bold;
		color: var(--text-title);
		padding: 0;
		margin: 0;
		width: 100%;
		box-sizing: border-box;
		outline: none;
	}

	.add-bundle-name:focus {
		background: transparent;
		border: none;
		outline: none;
		box-shadow: none;
	}

	/* Bundle name as text */
	.entry-title {
		font-size: 16px;
		font-weight: bold;
		color: var(--text-title);
		flex: 1 1 auto;
	}

	/* Buttons (accept/cancel) */
	.accept-button,
	.remove-button {
		background: transparent;
		color: var(--interactive-accent);
		border: none;
		border-radius: 6px;
		padding: 4px 8px;
		font-size: 18px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			background 0.2s,
			color 0.2s;
		box-shadow: none;
		outline: none;
	}

	.accept-button {
		color: var(--interactive-accent);
	}

	.accept-button:focus,
	.remove-button:focus,
	.accept-button:active,
	.remove-button:active {
		background: var(--background-modifier-hover);
		box-shadow: none;
		outline: none;
	}

	/* Item entry row for adding items */
	.add-item-entry-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* Disabled checkbox for item entry */
	.add-item-entry-row input[type="checkbox"] {
		margin-right: 8px;
	}

	/* Item name input: transparent, no border, looks like text */
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

	/* Amount input: transparent, no border, looks like text */
	.item-entry-amount-input {
		background: transparent;
		border: none;
		font-size: 16px;
		color: var(--text-muted);
		padding: 0;
		margin: 0;
		width: 60px;
		box-sizing: border-box;
		outline: none;
	}

	.item-entry-amount-input:focus {
		background: transparent;
		border: none;
		outline: none;
		box-shadow: none;
	}

	/* Save bundle button */
	.add-bundle-confirm {
		width: 100%;
		padding: 10px 0;
		font-size: 16px;
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		margin-top: 8px;
		transition: background 0.2s;
	}

	.add-bundle-confirm:hover {
		background: var(--interactive-accent-hover);
	}
	.item-details {
		padding-left: 0;
		margin-left: 0;
	}

	/* Responsive for mobile */
	@media (max-width: 600px) {
		.add-bundle-row {
			padding: 8px;
		}
		.add-bundle-name,
		.item-entry-name-input,
		.item-entry-amount-input {
			font-size: 15px;
		}
		.add-bundle-confirm {
			font-size: 15px;
		}
	}
</style>
