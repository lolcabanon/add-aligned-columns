---
title: addExpandedRows
description: Expand or collapse sub-rows of rows
sidebar_title: addExpandedRows
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addExpandedRows` expands and collapses sub-rows of rows. Sub-rows are defined by plugins such as [`addSubRows`](add-sub-rows.md) or [`addGroupBy`](add-group-by.md).

## Options

:::callout
Options passed into `addExpandedRows`.
:::

```ts {3}
const table = createTable(data, {
  expand: addExpandedRows({ ... }),
});
```

### `initialExpandedIds?: Record<string, boolean>`

Sets the initial expanded row ids.

Expanded row ids are stored as an object of row ids to `boolean`s. If `expandedIds[rowId]` is `true`, then `rowId` is expanded. Otherwise, `rowId` is not expanded.

The id of a sub-row is in the format `{parentId}>{id}`. A nested sub-row can be referred to by concatenating the ids of its parent rows to the top-level row.

_Defaults to `{}`_.

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
      expand: { ... },
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
    {rowProps.expand} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.expand} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

_Nothing here so far_.

## Plugin State

:::callout
State provided by `addExpandedRows`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.expand;
```

### `expandedIds: Writable<Record<string, boolean>>`

The current expanded row ids. Expanded row ids are stored as an object of row ids to booleans. If `expandedIds[rowId]` is true, then `rowId` is expanded. If `expandedIds[rowId]` is `undefined` or `false`, then `rowId` is not expanded.

The id of a sub-row is in the format `{parentId}>{id}`. A nested sub-row can be referred to by concatenating the ids of its parent rows to the top-level row.

### `getRowState: (row) => ExpandedRowsRowState`

`getRowState` takes a `BodyRow` and returns `ExpandedRowsRowState` for the row.

#### `ExpandedRowsRowState#isExpanded: Writable<boolean>`

Whether the row is expanded. Update the store to update the expanded state of the row.

#### `ExpandedRowsRowState#canExpand: Readable<boolean>`

Whether the row has sub-rows to expand.

#### `ExpandedRowsRowState#isAllSubRowsExpanded: Readable<boolean>`

Whether all sub-rows of the row are also expanded. If sub-rows are not expandable, defaults to `true`.

## Examples

### Simple row expanding

:::example

[REPL](https://svelte.dev/repl/19cdb4899a1b4f4483270b5a50853ad4?version=3.48.0)

<script>
  import SimpleExpandingDemo from './SimpleExpandingDemo.svelte'
</script>
<SimpleExpandingDemo />

:::

### Simple grouping by column

:::example

[REPL](https://svelte.dev/repl/2e94234dadb94884b445ff701ec888ee?version=3.48.0)

<script>
  import SimpleGroupByDemo from './SimpleGroupByDemo.svelte'
</script>
<SimpleGroupByDemo />

:::
