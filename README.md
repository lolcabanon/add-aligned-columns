<p align="center">
  <img src="https://user-images.githubusercontent.com/42545742/169733428-295e2678-e509-4175-aeb3-cb3a9c9894e1.svg" alt="svelte-headless-table" width="200px"/>
</p>
<h1 align="center"><code>addAlignedColumns</code> plugin for <a href="https://github.com/bryanmylee/svelte-headless-table">Svelte Headless Table</a></h1>

<div align="center">

[![npm version](http://img.shields.io/npm/v/add-aligned-columns.svg)](https://www.npmjs.com/package/add-aligned-columns)
[![npm downloads](https://img.shields.io/npm/dm/add-aligned-columns.svg)](https://www.npmjs.com/package/add-aligned-columns)
![license](https://img.shields.io/npm/l/add-aligned-columns)
![build](https://img.shields.io/github/actions/workflow/status/lolcabanon/add-aligned-columns/publish.yml)

<!--[![coverage](https://coveralls.io/repos/github/lolcabanon/add-aligned-columns/badge.svg?branch=main)](https://coveralls.io/github/lolcbanon/add-aligned-columns?branch=main)-->

</div>

**See `svelte-headless-table` documentation for details.**

> **Unopinionated and extensible data tables for Svelte**
>
> Build and design powerful datagrid experiences while retaining 100% control over styles and markup.
>
> Visit the [documentation](https://svelte-headless-table.bryanmylee.com/) for code examples and API reference, and get started with the [quick start guide](https://svelte-headless-table.bryanmylee.com/docs/getting-started/quick-start)!

<!--
## Examples

<!-- prettier-ignore -- >
```svelte
<script>
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
```

For more complex examples with advanced features, visit the [documentation site](https://svelte-headless-table.bryanmylee.com/docs/plugins/overview).
-->
