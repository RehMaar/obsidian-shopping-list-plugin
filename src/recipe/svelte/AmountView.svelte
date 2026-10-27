<script lang="ts">
	import { Amount, Ratio } from "../types";

    export let amount: Amount;
</script>

<span class=amount>
    {#if amount.amount instanceof Ratio}
        {amount.amount.numerator}/{amount.amount.denominator}
    {:else}
        {amount.amount}
    {/if}
{#if amount.unit != null}
    {amount.unit}
{/if}
</span>

<style>
    .amount {
        white-space: nowrap;
    }
</style>