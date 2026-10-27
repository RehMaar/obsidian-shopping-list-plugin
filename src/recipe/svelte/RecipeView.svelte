<script lang="ts">
    import RecordView from "./RecordView.svelte";
    import HeaderView from "./HeaderView.svelte";

	import type { ParseError } from "../parser/types";
    import { Recipe } from "../types";

    export let recipe: Recipe;
    export let errors: ParseError[];
</script>

<div class=recipe-container>
<HeaderView portions={recipe.defined_portions}/>
{#each recipe.list as record}
    <RecordView record={record.item}/>
    {#if record.alternatives}
        {#each record.alternatives as alt}
            <div class=record_alt><RecordView record={alt}/></div>
        {/each}
    {/if}
{/each}
</div>

<style>
    .recipe-container {
        background: var(--background-secondary);
		border-radius: var(--radius-l);
		box-shadow: 0 var(--size-2-1) var(--size-2-2) rgba(0, 0, 0, 0.1);
		padding: var(--size-2-3);

		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
    }

    .record_alt {
        margin-left: 5%;    
    }
</style>