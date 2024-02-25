---
title: addSortBy
description: Sort table rows by column values
sidebar_title: addSortBy
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addSortBy` sorts table rows by column values.

## Options

:::callout
Options passed into `addSortBy`.
:::

```ts {3}
const table = createTable(data, {
  sort: addSortBy({ ... }),
});
```

### `initialSortKeys?: SortKey[]`

Sets the initial sort keys.

_Defaults to `[]`_.

### `disableMultiSort?: boolean`

Disables multi-sorting for the table.

_Defaults to `false`_.

### `isMultiSortEvent?: (event: Event) => boolean`

Allows overriding the default multi-sort behavior.

Takes an [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) and returns whether the action triggers a multi-sort.

_Defaults to multi-sort on shift-click_.

### `toggleOrder?: ()[]`

Allows customization of the toggling order. This cannot contain duplicate values. Set this to `['asc', 'desc']` to disable toggling to an unsorted column.

_Defaults to `['asc', 'desc', undefined]`_.

### `serverSide?: boolean`

If `true`, the sort plugin will have no effect on the rows of the table. Instead, you can control sorting by updating [`$data`](../api/create-table.md#createtable-data-plugins-table). The plugin's state can be used as variables in your data-fetching query to get sorted data from the server directly.

_Defaults to `false`_.

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
      sort: { ... },
    },
  }),
]);
```

### `disable?: boolean`

Disables sorting on the column.

_Defaults to `false`_.

### `compareFn?: (leftValue, rightValue) => number`

Receives a left and right value to compare for sorting.

If `leftValue` should come before `rightValue`, return a negative number.

If `rightValue` should come before `leftValue`, return a positive number.

Otherwise if both values are equal in sorting priority, return 0. 

### `getSortValue?: (value) => string | number | (string | number)[]`

Receives the value of the column cell and returns the value to sort the column on.

Useful for sorting a column that contains complex data.

If a `number` is returned, sort numerically. If a `string` is returned, sort alphabetically.

If an array is returned, sort on the first non-matching element.

_Defaults to (value) => value_.

### `invert?: boolean`

Reverses the underlying sorting direction.

Useful for sorting negative numbers i.e. ascending order becomes _-1, -2, -3_...

_Defaults to `false`_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.sort} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.sort} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

### HeaderCell

#### `order: 'asc' | 'desc' | undefined`

The order of the data column represented by the header cell. If `undefined`, the data column is not sorted.

#### `disabled: boolean`

Whether the data column represented by the header cell has sorting disabled.

#### `toggle: (event: Event) => void`

Toggles sorting on the data column represented by the header cell (from `'asc'` to `'desc'` to `undefined`).

#### `clear: () => void`

Clears sorting on the data column represented by the header cell.

### BodyCell

#### `order: 'asc' | 'desc' | undefined`

The order of the data column on which the body cell is. If `undefined`, the data column is not sorted.

## Plugin State

:::callout
State provided by `addSortBy`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.sort;
```

### `preSortedRows: Readable<BodyRow<Item>[]>`

The view model rows before sorting.

### `sortKeys: WritableSortKeys`

The active sorting keys.

`WritableSortKeys` is equivalent to `Writable<SortKey[]>` with an additional `toggleId` method.

#### `WritableSortKeys#toggleId: (id: string, options: { multiSort: boolean }) => void`

Toggles sorting on the column with `id` (from `'asc'` to `'desc'` to `undefined`).

#### `WritableSortKeys#clearId: (id: string) => void`

Clears sorting on the column with `id`.

#### `SortKey`

```ts
export interface SortKey {
  id: string;
  order: 'asc' | 'desc';
}
```

## Examples

### Simple sorting

:::example

[REPL](https://svelte.dev/repl/0085427077dc49c8b648b2a6972987c0?version=3.48.0)

<script>
  import SimpleSortingDemo from './SimpleSortingDemo.svelte'
</script>
<SimpleSortingDemo />

:::
