<script lang="ts">
	import { BrushCleaning } from "lucide-svelte";

	import store from "../../store";
	import type ShoppingListPlugin from "../../main";
	import type { BundleEntry, ItemEntry, Error } from "../../types";
	import { ConfirmModal } from "../ConfirmModal";

	import ShoppingBundle from "./ShoppingBundle.svelte";
	import AddShoppingBundle from "./AddShoppingBundle.svelte";

	let plugin: ShoppingListPlugin;
	store.plugin.subscribe((p) => (plugin = p));

	export let error: Error | null;
	export let entries: BundleEntry[];
	export let onSave: (entries: BundleEntry[]) => void;

	let isDoneFolded: boolean = true;

	$: doneBundlesCount = entries.filter((e) => e.done).length;
	$: doneText = doneBundlesCount == 1 ? "bundle" : "bundles";

	function refreshPage() {
		entries = [...entries]; // Trigger reactivity
	}

	function addBundle(bundle: BundleEntry) {
		entries = [...entries, bundle]; // Add the new bundle to the original entries array
		refreshPage(); // Refresh the page to reflect changes
		onSave(entries); // Save the updated entries
	}

	function toggleFold(entry: BundleEntry) {
		entry.toggleFolded();

		refreshPage(); // Refresh the page to reflect changes
		onSave(entries);
	}

	function toggleDone(entry: BundleEntry) {
		entry.toggleDone();

		refreshPage(); // Refresh the page to reflect changes
		onSave(entries);
	}

	function toggleItemDone(itemEntry: ItemEntry) {
		itemEntry.toggleDone();

		refreshPage(); // Refresh the page to reflect changes
		onSave(entries);
	}

	// Function to remove a bundle
	function removeBundle(entry: BundleEntry) {
		console.log("Removing bundle:", entry);
		new ConfirmModal(
			plugin.app,
			"Are you sure you want to remove this bundle?",
			() => {
				entries = entries.filter((e) => e !== entry);
				onSave(entries);
			},
		).open();
	}

	function cleanAllDone() {
		new ConfirmModal(
			plugin.app,
			"Are you sure you want to clear all done bundles?",
			() => {
				entries = entries.filter((e) => !e.done);
				onSave(entries);
			},
		).open();
	}

	function cleanAll() {
		new ConfirmModal(
			plugin.app,
			"Are you sure you want to clear all done bundles?",
			() => {
				entries = entries.filter((e) => e.done);
				onSave(entries);
			},
		).open();
	}
</script>

<div class="shopping-list-container">
	<div class="shopping-list">
		<header class="shopping-list-header">
			<h1>Shopping List</h1>
			<div class="header-buttons">
				<button
					class="button"
					aria-label="Clear all"
					on:click={cleanAll}
				>
					<BrushCleaning />
				</button>
			</div>
		</header>

		{#if error != null}
			<div class="error-message-box">
				{error.message}
				<br />
				<br />
				Probably, the file was changed outside. This issue will be fixed
				automatically when you close this file, however some changes may
				be lost.
			</div>
		{/if}

		{#each entries as bundle}
			{#if !bundle.done}
				<ShoppingBundle
					{bundle}
					onDone={toggleDone}
					onFold={toggleFold}
					onRemove={removeBundle}
					onItemDone={toggleItemDone}
				/>
			{/if}
		{/each}

		<AddShoppingBundle onFinish={addBundle} />
	</div>

	{#if doneBundlesCount > 0}
		<div class="shopping-list done-list">
			<header class="shopping-list-header">
				<div
					on:click={() => (isDoneFolded = !isDoneFolded)}
					on:keydown={(e) =>
						e.key === "Enter" && (isDoneFolded = !isDoneFolded)}
					role="button"
					tabindex="0"
				>
					<h1>Shopping List Done</h1>
					<span class="done-count"
						>({doneBundlesCount} {doneText})</span
					>
				</div>
				<button
					class="button"
					aria-label="Clear all"
					on:click={cleanAllDone}
				>
					<BrushCleaning />
				</button>
			</header>

			{#if !isDoneFolded}
				{#each entries as bundle}
					{#if bundle.done}
						<ShoppingBundle
							{bundle}
							onDone={toggleDone}
							onFold={toggleFold}
							onRemove={removeBundle}
							onItemDone={toggleItemDone}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	/* General Styles */
	.shopping-list-container {
		background: var(--background-primary);
		border-radius: var(--radius-m);
		box-shadow: 0 var(--size-2-1) var(--size-2-2) rgba(0, 0, 0, 0.2);
		width: 100%;
		padding: var(--size-4-4);
		margin: 0 auto;
		color: var(--text-normal);
	}
	.shopping-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--size-4-4);
	}

	.shopping-list-header h1 {
		font-size: var(--font-text-size);
		color: var(--text-title);
		margin: 0;
	}

	.header-buttons {
		display: flex;
		gap: var(--size-4-2);
	}

	.done-list {
		margin-top: var(--size-4-12);
	}

	.button {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		box-shadow: none;
		outline: none;
		color: var(--interactive-accent);
		padding: 0;
		margin-left: auto;
		font-size: var(--icon-l);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.3s ease;
	}

	.button:hover {
		color: var(--interactive-accent-hover);
	}

	.done-count {
		font-style: italic;
		color: var(--text-muted);
	}

	.error-message-box {
		background: var(--background-primary-alt);
		border-radius: var(--radius-m);
		box-shadow: 0 var(--size-2-1) var(--size-2-2) rgba(0, 0, 0, 0.2);
		width: 100%;
		padding: var(--size-4-4);
		margin: 0 auto;
		color: var(--text-error);
		margin-bottom: var(--size-4-4);
	}
</style>
