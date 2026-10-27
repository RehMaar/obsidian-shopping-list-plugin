<script lang="ts">
	import { SquarePlus, SquareMinus, ShoppingCart } from "lucide-svelte";

    export let portions;
</script>

<header class=recipe-header>
    <button class="button cart_button"><ShoppingCart/></button>
    <div class="portions_control">
        <button class="button"><SquareMinus/></button>
        <span>{portions}</span>
        <button class="button"><SquarePlus/></button>
    </div>
</header>

<style>
    .recipe-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		gap: var(--size-4-2);
		font-size: var(--font-text-size);
		font-weight: var(--font-bold);
	}

	.portions_control {
		grid-column: 2;
		display: flex;
		align-items: center;
		gap: var(--size-4-2);
	}

	.cart_button {
		grid-column: 1;
		justify-self: start;
	}

    .button {
        background: none;
		border: none;
		padding: var(--size-2-2);
		margin: 0;
		box-shadow: none;
		outline: none;
		color: var(--interactive-accent);
		cursor: pointer;
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