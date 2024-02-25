---
title: Credits
description: Contributors to Svelte Headless Table
---

# {$frontmatter?.title}

<script lang="ts">
  import { readable } from 'svelte/store';
  import { createTable, createRender, Render, Subscribe } from 'svelte-headless-table';
  import { addSortBy } from 'svelte-headless-table/plugins';
  import CreditsAnchor from './CreditsAnchor.svelte';
  import CreditsHtml from './CreditsHtml.svelte';
  import CaretDownIcon from '~icons/ic/round-keyboard-arrow-down';
  
  const data = readable([
    {
      name: 'React Table',
      description: 'Svelte Headless Table takes inspiration for its column model from React Table.',
      url: 'https://react-table.tanstack.com/',
    },
    {
      name: 'KitDocs',
      description: 'The documentation site is built with KitDocs.',
      url: 'https://kitdocs.vercel.app/docs/getting-started/introduction',
    },
    {
      name: '@blerrgh',
      description: 'For designing and implementing a server-side API',
      url: 'https://github.com/blerrgh'
    },
    {
      name: '@risalfajar',
      description: 'For better column id inference and native Date sorting on the <code>addSortBy</code> plugin.',
      url: 'https://github.com/risalfajar'
    }
  ]);

  const table = createTable(data, {
    sort: addSortBy(),
  });

  const columns = table.createColumns([
    table.column({
      header: 'Name',
      id: 'name',
      accessor: item => item,
      cell: ({ value: { name, url }}) => createRender(CreditsAnchor, { label: name, href: url }),
      plugins: {
        sort: {
          getSortValue: ({ name }) => name,
        }
      },
    }),
    table.column({
      header: 'Description',
      accessor: 'description',
      cell: ({ value }) => createRender(CreditsHtml, { html: value }),
    }),
  ]);
  const { headerRows, rows } = table.createViewModel(columns);
</script>

<table>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <tr>
        {#each headerRow.cells as cell (cell.id)}
          <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
            <th {...attrs} on:click={props.sort.toggle}>
              <div class="flex items-center">
                <Render of={cell.render()} />
                {#if props.sort.order !== undefined}
                  <CaretDownIcon
                    class="transition-transform {props.sort.order === 'desc' && '-scale-y-100'}"
                  />
                {/if}
              </div>
            </th>
          </Subscribe>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each $rows as row (row.id)}
      <tr>
        {#each row.cells as cell (cell.id)}
          <Subscribe attrs={cell.attrs()} let:attrs>
            <td {...attrs}>
              <Render of={cell.render()} />
            </td>
          </Subscribe>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

:::admonition type="note"

The credits are also managed by Svelte Headless Table!

View the code [here](https://svelte.dev/repl/4bf807f8def64c3e97c3c062641358b2?version=3.48.0).

:::
