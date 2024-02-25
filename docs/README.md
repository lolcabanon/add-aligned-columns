<!-- ```sh
$ (cd ../; pnpm run build)
$ pnpm install
$ pnpm run sync
$ pnpm run dev
``` -->

<p align="center">
  <img src="https://user-images.githubusercontent.com/42545742/169733428-295e2678-e509-4175-aeb3-cb3a9c9894e1.svg" alt="svelte-headless-table" width="200px"/>
</p>
<h1 align="center"><code>addAlignedColumns</code> plugin for <a href="https://github.com/bryanmylee/svelte-headless-table">Svelte Headless Table</a></h1>

<div align="center">

<p><a href="https://www.npmjs.com/package/add-aligned-columns" rel="nofollow"><img src="https://camo.githubusercontent.com/732c2b9683232e65e63d0beca0f2871835522ede89fbe9aca676aee020582f03/687474703a2f2f696d672e736869656c64732e696f2f6e706d2f762f6164642d616c69676e65642d636f6c756d6e732e737667" alt="npm version" data-canonical-src="http://img.shields.io/npm/v/add-aligned-columns.svg" style="max-width: 100%;"></a>
<a href="https://www.npmjs.com/package/add-aligned-columns" rel="nofollow"><img src="https://camo.githubusercontent.com/33912a77a0dc74ce638d16040139b43b3c04a6c23f74823117beea2ab60d4b65/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f646d2f6164642d616c69676e65642d636f6c756d6e732e737667" alt="npm downloads" data-canonical-src="https://img.shields.io/npm/dm/add-aligned-columns.svg" style="max-width: 100%;"></a>
<a target="_blank" rel="noopener noreferrer nofollow" href="https://camo.githubusercontent.com/330f69b415b87cc320933cc62b2a8955cd8fab7ac34f03fc1e3118f4e420a844/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f6164642d616c69676e65642d636f6c756d6e73"><img src="https://camo.githubusercontent.com/330f69b415b87cc320933cc62b2a8955cd8fab7ac34f03fc1e3118f4e420a844/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f6c2f6164642d616c69676e65642d636f6c756d6e73" alt="license" data-canonical-src="https://img.shields.io/npm/l/add-aligned-columns" style="max-width: 100%;"></a>
<a target="_blank" rel="noopener noreferrer nofollow" href="https://camo.githubusercontent.com/7de4d957f15910da61ca7aa7bc6c8b72d8c27ef4cd02c35aebd51de73d4b0ca2/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f616374696f6e732f776f726b666c6f772f7374617475732f6c6f6c636162616e6f6e2f6164642d616c69676e65642d636f6c756d6e732f7075626c6973682e796d6c"><img src="https://camo.githubusercontent.com/7de4d957f15910da61ca7aa7bc6c8b72d8c27ef4cd02c35aebd51de73d4b0ca2/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f616374696f6e732f776f726b666c6f772f7374617475732f6c6f6c636162616e6f6e2f6164642d616c69676e65642d636f6c756d6e732f7075626c6973682e796d6c" alt="build" data-canonical-src="https://img.shields.io/github/actions/workflow/status/lolcabanon/add-aligned-columns/publish.yml" style="max-width: 100%;"></a></p>
<!-- 
[![npm version](http://img.shields.io/npm/v/add-aligned-columns.svg)](https://www.npmjs.com/package/add-aligned-columns)
[![npm downloads](https://img.shields.io/npm/dm/add-aligned-columns.svg)](https://www.npmjs.com/package/add-aligned-columns)
![license](https://img.shields.io/npm/l/add-aligned-columns)
![build](https://img.shields.io/github/actions/workflow/status/lolcabanon/add-aligned-columns/publish.yml) -->

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
