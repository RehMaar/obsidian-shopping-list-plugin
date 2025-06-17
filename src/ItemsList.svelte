<script lang="ts">
  import store from "./store";
  import type ShoppingListPlugin from "./main";
  import { type Item } from "./types";

  export let items: Array<Item>;
  let plugin: ShoppingListPlugin;
  store.plugin.subscribe((p) => (plugin = p));

  function copyToFile() {
    if (!plugin) {
      console.error("Plugin is not initialized.");
      return;
    }
    plugin.copyToFile(items);
  }

</script>

<button on:click={copyToFile}>Add to the Shopping list</button>

<table>
  <tbody>
    {#each items as item}
      <tr>
        <td>{item.name}</td>
        <td>{item.amount}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    border: none;
  }

  td {
    padding: 8px;
    text-align: left;
    border: none;
  }

</style>