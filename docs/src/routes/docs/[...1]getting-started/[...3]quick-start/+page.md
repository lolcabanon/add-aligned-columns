---
title: Quick Start
description: Build your first table with Svelte Headless Table
---

# {$frontmatter?.title}

At the core of every Svelte Headless Table is the `createTable` function.

`createTable` creates a table instance that defines the data source and plugins to use.

:::admonition type="note"
Svelte Headless Table makes extensive use of Svelte stores. Don't worry if you are not familiar with stores, this tutorial will guide you through the process!
:::

## Getting your data

In its most basic form, a table converts **data items** into **rows**, and provides **columns** to access the properties of each data item.

Svelte Headless Table takes the innovative approach of defining the rows and plugins first when creating a table instance, then later defining the columns used to structure the table instance.

To start, define some data in a Svelte store and create your table with `createTable`.

```ts
const data = readable([
  { name: 'Ada Lovelace', age: 21 },
  { name: 'Barbara Liskov', age: 52 },
  { name: 'Richard Hamming', age: 38 },
]);

const table = createTable(data);
```

:::admonition type="info"
`data` does not have to be a `Readable` store; a `Writable` store can be used if data needs to be dynamically updated (e.g. when lazy fetching data from the server). For this quick start guide, a `Readable` is all we need!
:::

## Defining your columns

Once we have our table instance, we can create columns to access the values of each data item.

```ts
const columns = table.createColumns([
  table.column({
    header: 'Name',
    accessor: 'name',
  }),
  table.column({
    header: 'Age',
    accessor: 'age',
  }),
]);
```

## Creating the view model

Now that we've defined our data source and columns, we can get the view model for our first table UI.

<!-- prettier-ignore -->
```ts
const {
  headerRows,
  rows,
  tableAttrs,
  tableBodyAttrs,
} = table.createViewModel(columns);
```

## Applying to markup

HTML tables have a standard structure.

```html
<table>
  <thead>
    <tr>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td></td>
    </tr>
  </tbody>
</table>
```

We apply our view model over the structure.

```svelte
<table {...$tableAttrs}>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <th {...attrs}>
                <Render of={cell.render()} />
              </th>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </thead>
  <tbody {...$tableBodyAttrs}>
    {#each $rows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <td {...attrs}>
                <Render of={cell.render()} />
              </td>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </tbody>
</table>
```

:::admonition type="info"
`Subscribe` and `Render` are provided by Svelte Headless Table to overcome certain limitations of Svelte. Read more about [Subscribe](../../api/subscribe.md) and [Render](../../api/--render.md).
:::

## Final result

Putting it all together, we have a very simple table.

Explore this example in the [REPL](https://svelte.dev/repl/08cb356f4fad4c03ae331fe8ca77c726?version=3.48.0).

<script>
  import Demo from './Demo.svelte';
</script>
<Demo />

:::example

<!-- prettier-ignore -->
```svelte
<script>
  import { createTable, Subscribe, Render } from 'svelte-headless-table';
  import { readable } from "svelte/store";

  const data = readable([
    { name: 'Ada Lovelace', age: 21 },
    { name: 'Barbara Liskov', age: 52 },
    { name: 'Richard Hamming', age: 38 },
  ]);

  const table = createTable(data);

  const columns = table.createColumns([
    table.column({
      header: 'Name',
      accessor: 'name',
    }),
    table.column({
      header: 'Age',
      accessor: 'age',
    }),
  ]);

  const {
    headerRows,
    rows,
    tableAttrs,
    tableBodyAttrs,
  } = table.createViewModel(columns);
</script>

<table {...$tableAttrs}>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <th {...attrs}>
                <Render of={cell.render()} />
              </th>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </thead>
  <tbody {...$tableBodyAttrs}>
    {#each $rows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <td {...attrs}>
                <Render of={cell.render()} />
              </td>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-spacing: 0;
    border-top: 1px solid black;
    border-left: 1px solid black;
  }

  th,
  td {
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    padding: 0.5rem;
  }
</style>
```

:::

## What's next?

We are now ready to extend our table with powerful features using the [Plugin System](../../plugins/overview.md)!
