---
title: addHiddenColumns
description: Hide table columns
sidebar_title: addHiddenColumns
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addHiddenColumns` hides table columns dynamically.

## Options

:::callout
Options passed into `addHiddenColumns`.
:::

```ts {3}
const table = createTable(data, {
  hide: addHiddenColumns({ ... }),
});
```

### `initialHiddenColumnIds?: string[]`

Sets the initial hidden column ids.

_Defaults to `[]`_.

## Column Options

:::callout
Options passed into column definitions.
:::

```ts {7}
const columns = table.createColumns([
  table.column({
    header: 'Name',
    accessor: 'name',
    plugins: {
      hide: { ... },
    },
  }),
]);
```

_Nothing here so far_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.hide} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.hide} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

_Nothing here so far_.

## Plugin State

:::callout
State provided by `addHiddenColumns`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.hide;
```

### `hiddenColumnIds: Writable<string[]>`

The active hidden column ids.

## Examples

### Simple hidden columns

:::example

[REPL](https://svelte.dev/repl/0f910f546dfe467998886ea0510f4790?version=3.48.0)

<script>
  import SimpleHiddenColumnsDemo from './SimpleHiddenColumnsDemo.svelte'
</script>
<SimpleHiddenColumnsDemo />

:::
