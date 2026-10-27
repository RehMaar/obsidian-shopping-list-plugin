<script lang="ts">
    import AmountView from "./AmountView.svelte";
    import { RecordedItem, RawItem, Ratio, Amount } from "../types";


    export let record: RecordedItem;
</script>

<ul class=record_line>
{#if record.item instanceof RawItem}
    <span class=item_name>{record.item.name}</span>
    <span class=item_amount>
        {#if record.item.amount instanceof Amount}
            <AmountView amount={record.item.amount}/>
        {:else if record.item.amount != null}
            record.item.amount
        {/if}
    </span>
    {#if record.comment != null}
    <span class=item_comment>{record.comment}</span>
    {/if}
{:else}
    <span class=item_name>
        <a
            href={record.item.link}
            data-href={record.item.link}
            class="internal-link"
        >{record.item.linkName ?? record.item.link}</a>
    </span>
    <span class=item_amount>
        {#if record.item.portions instanceof Ratio}
            {record.item.portions.numerator}/{record.item.portions.denominator}
        {:else}
            {record.item.portions}
        {/if}
    </span>
{/if}
</ul>

<style>
    .record_line {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		background: var(--background-primary-alt);
		align-items: center;
		transition: background-color 0.3s ease;
		border-radius: var(--radius-s);
		gap: var(--size-2-2);
		padding: var(--size-2-3) var(--size-4-3);
		margin: var(--size-4-2);
		min-height: var(--size-4-8);
		height: auto;
        width: auto;
    }

	.item_name {
		justify-self: start;
		font-size: var(--font-text-size);
		color: var(--text-normal);
		overflow-wrap: break-word;
		max-width: 60%;
	}

	.item_amount {
		justify-self: center;
		font-size: var(--font-text-size);
		color: var(--text-muted);
		font-style: italic;
		overflow-wrap: break-word;
	}

    .item_comment {
        font-size: var(--font-text-size);
		color: var(--text-muted);
		font-style: italic;
		overflow-wrap: break-word;
		margin-left: var(--size-4-2);
        justify-self: end;
        text-align: right;
    }
</style>