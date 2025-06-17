<script lang="ts">
	import { SquareCheck, SquareX, SquarePlus } from "lucide-svelte";

	export let isCreating: boolean;

	export let newBundleName: string = "";
	export let acceptBundleName: (name: string) => void;
	export let cancelAddBundle: () => void;
	export let finalizeBundle: (name: string) => void;
</script>

<div class="item-header">
	<input
		type="checkbox"
		checked={false}
		disabled
		tabindex="-1"
		style="pointer-events: none"
	/>
	<!-- We leave here an input box to be able to modify -->
	<input
		class="entry-title add-bundle-name"
		type="text"
		bind:value={newBundleName}
		placeholder="Bundle name"
		on:keydown={(e) => e.key === "Enter" && acceptBundleName(newBundleName)}
	/>

	{#if isCreating}
		<button
			class="button"
			on:click={() => acceptBundleName(newBundleName)}
			aria-label="Accept name"
		>
			<SquarePlus />
		</button>
	{:else}
		<button
			class="button"
			on:click={() => finalizeBundle(newBundleName)}
			aria-label="Save bundle"
		>
			<SquareCheck />
		</button>
	{/if}

	<button class="button" on:click={cancelAddBundle} aria-label="Cancel">
		<SquareX />
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
	.entry-title {
		cursor: pointer;
		flex: 1 1 auto;
		font-size: var(--font-text-size);
		color: var(--text-title);
		font-weight: bold;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		outline: none;
		min-width: 0;
		display: flex;
		align-items: center;
	}
	.entry-title:focus {
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
		cursor: pointer;
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
</style>
