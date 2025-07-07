<script lang="ts">
	import { SquarePen } from "lucide-svelte";

	import type { BundleEntry } from "../../types";

	export let bundle: BundleEntry;

	export let toggleDone: (bundle: BundleEntry) => void;
	export let toggleFold: (bundle: BundleEntry) => void;
	export let onModify: (bundle: BundleEntry) => void;
</script>

<div class="item-header">
	<!-- Checkbox for marking the entry as done -->
	<input
		class="checkbox"
		type="checkbox"
		checked={bundle.done}
		on:change={() => toggleDone(bundle)}
	/>
	<!-- I've no idea what's ARIA role and tabindex, so it may backfire someday -->
	<div
		class="entry-title-container"
		role="button"
		tabindex="0"
		on:click={() => toggleFold(bundle)}
		on:keydown={(e) => e.key === "Enter" && toggleFold(bundle)}
		aria-label={bundle.folded ? "Expand bundle" : "Collapse bundle"}
	>
		<span class="entry-title">{bundle.name}</span>
	</div>

	<button
		class="button"
		on:click={() => onModify(bundle)}
		aria-label="Modify"
	>
		<SquarePen />
	</button>
</div>

<style>
	.item-header {
		display: flex;
		align-items: center;
		gap: var(--size-4-2);
		font-size: var(--font-text-size);
		font-weight: var(--font-bold);
		color: var(--text-title);
	}

	.entry-title-container {
		cursor: pointer;
		transition: background 0.2s;
		border: none;
		flex: 1 1 auto;
		color: var(--text-title);
		font-size: var(--font-text-size);
		font-weight: var(--font-bold);
		text-align: left;
		padding: 0;
		display: flex;
		align-items: center;
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
