---
title: TableViewModel
description: The view model of the data table
sidebar_title: TableViewModel
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`TableViewModel` contains the `Readable` stores that describe the structure of the table. Apply the view model onto your markup.

```ts
const {
  headerRows,
  rows,
  tableAttrs,
  tableHeadAttrs,
  tableBodyAttrs,
  ...
} = table.createViewModel(columns);
```

## Usage

### Attributes

#### `TableViewModel#tableAttrs: Readable<TableAttributes>`

A `Readable` store with attributes to apply onto the `<table>` element.

#### `TableViewModel#tableHeadAttrs: Readable<TableHeadAttributes>`

A `Readable` store with attributes to apply onto the `<thead>` element.

#### `TableViewModel#tableBodyAttrs: Readable<TableBodyAttributes>`

A `Readable` store with attributes to apply onto the `<tbody>` element.

### Rows

#### `TableViewModel#headerRows: Readable<HeaderRow[]>`

A `Readable` store with an array of [`HeaderRow`](../header-row.md)s that represent `<tr>` elements in `<thead>`.

```svelte
<thead>
  {#each $headerRows as headerRow (headerRow.id)}
    <Subscribe attrs={headerRow.attrs()} let:attrs>
      <tr {...attrs}>...</tr>
    </Subscribe>
  {/each}
</thead>
```

#### `TableViewModel#rows: Readable<BodyRow[]>`

A `Readable` store with an array of [`BodyRow`](../body-row.md)s that represent `<tr>` elements in `<tbody>`.

```svelte
<tbody>
  {#each $rows as row (row.id)}
    <Subscribe attrs={row.attrs()} let:attrs>
      <tr {...attrs}>...</tr>
    </Subscribe>
  {/each}
</tbody>
```

#### `TableViewModel#pageRows: Readable<BodyRow[]>`

A `Readable` store with an array of `BodyRow`s that represent `<tr>` elements **of the current page** in `<tbody>`.

`$pageRows` is affected by pagination plugins while `$rows` is not. If no pagination plugin is used, `$pageRows` is equal to `$rows`.

```svelte
<tbody>
  {#each $pageRows as row (row.id)}
    <Subscribe attrs={row.attrs()} let:attrs>
      <tr {...attrs}>...</tr>
    </Subscribe>
  {/each}
</tbody>
```

#### `TableViewModel#originalRows: Readable<BodyRow[]>`

A `Readable` store with an array of `BodyRow`s that represent `<tr>` elements in `<tbody>` before plugin transformations.

### Columns

#### `TableViewModel#visibleColumns: Readable<DataColumn[]>`

A `Readable` store with an array of `DataColumn`s that represent the currently visible data columns of the table after plugin transformations.

`$visibleColumns` is useful if you need to know how many columns are currently displayed on the table.

#### `TableViewModel#flatColumns: FlatColumn[]`

An array of `FlatColumn`s that represent the flat columns of the table before plugin transformations.

Flat columns usually represent the last row of columns in your header, which includes data columns and display columns. They are distinct from group columns which must by definition be one row above other columns.

### Plugins

#### `TableViewModel#pluginStates: PluginStates`

An object of plugin states exposed by each plugin used.

:::admonition type="tip"
See also [Plugin State](../plugins/overview#controlling-plugin-state).
:::
