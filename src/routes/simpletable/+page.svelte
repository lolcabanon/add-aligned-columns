<script lang="ts">
	import { derived, readable, get } from 'svelte/store';
	import { createRender } from 'svelte-render';
	import { Render, Subscribe, createTable } from 'svelte-headless-table';
	import { addAlignedColumns, type ColumnAlignment } from '../../lib/index.js';
	import { mean, sum } from '$lib/utils/math.js';
	import { getShuffled } from '../_getShuffled.js';
	import { createSamples } from '../_createSamples.js';
	import Italic from '../_Italic.svelte';
	import Profile from '../_Profile.svelte';
	import Tick from '../_Tick.svelte';
	import TextFilter from '../_TextFilter.svelte';
	import NumberRangeFilter from '../_NumberRangeFilter.svelte';
	import SelectFilter from '../_SelectFilter.svelte';
	import ExpandIndicator from '../_ExpandIndicator.svelte';
	import { getDistinct } from '$lib/utils/array.js';
	import SelectIndicator from '../_SelectIndicator.svelte';

	const data = readable(createSamples(10, 2));

	let serverSide = false;

	let defaultAlignment: ColumnAlignment | undefined;

	const table = createTable(data, {
		align: addAlignedColumns({
			defaultAlignment,
			// toggleOrder: ['auto', 'right'],
			alignmentType: 'text',
			defaultDisable: true,
			// defaultToggle: false,
		}),
	});

	const columns = table.createColumns([
		table.column({
			header: 'Summary',
			id: 'summary',
			accessor: (item) => item,
			cell: ({ value }) =>
				createRender(Profile, {
					age: value.age,
					progress: value.progress,
					name: `${value.firstName} ${value.lastName}`,
				}),
		}),
		table.group({
			header: (_, { rows, pageRows }) =>
				derived(
					[rows, pageRows],
					([_rows, _pageRows]) => `Name (${_rows.length} records, ${_pageRows.length} in page)`,
				),
			columns: [
				table.column({
					header: (cell) => {
						return createRender(Italic, { text: `First Name` });
					},
					accessor: 'firstName',
				}),
				table.column({
					header: () => 'Last Name',
					accessor: 'lastName',
				}),
			],
		}),
		table.group({
			header: (_, { rows }) =>
				createRender(
					Italic,
					derived(rows, (_rows) => ({ text: `Info (${_rows.length} samples)` })),
				),
			columns: [
				table.column({
					header: 'Age',
					accessor: 'age',
					plugins: {
						align: {
							initialAlignment: 'center',
							disable: false,
							noToggle: false,
						},
					},
				}),
				table.column({
					header: createRender(Tick),
					id: 'status',
					accessor: (item) => item.status,
					plugins: {
						align: {
							disable: true,
						},
					},
				}),
				table.column({
					header: 'Visits',
					accessor: 'visits',
					plugins: {
						align: {
							initialAlignment: 'right',
							alignOn: 'tbody',
							disable: false,
							noToggle: true,
						},
					},
				}),
				table.column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			],
		}),
	]);

	const { headerRows, pageRows, rows, tableAttrs, tableBodyAttrs, visibleColumns, pluginStates } =
		table.createViewModel(columns);

	const { alignments, alignDefault } = pluginStates.align;
</script>

<h1>svelte-headless-table</h1>

<div class="default-table-align">
	Table default alignment :
	<label for="rb_auto">
		auto
		<input type="radio" id="rb_auto" value="auto" bind:group={$alignDefault} />
	</label>
	<label for="rb_left">
		left
		<input type="radio" id="rb_left" value="left" bind:group={$alignDefault} />
	</label>
	<label for="rb_center">
		center
		<input type="radio" id="rb_center" value="center" bind:group={$alignDefault} />
	</label>
	<label for="rb_right">
		right
		<input type="radio" id="rb_right" value="right" bind:group={$alignDefault} />
	</label>
	(current : {$alignDefault})
</div>

<table {...$tableAttrs}>
	<thead>
		{#each $headerRows as headerRow (headerRow.id)}
			<Subscribe attrs={headerRow.attrs()} let:attrs>
				<tr {...attrs}>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
							<th {...attrs}>
								<div>
									<Render of={cell.render()} />
								</div>

								{#if !props.align.noToggle}
									<button use:props.align.toggle>
										{props.align.alignment}
									</button>
									<button use:props.align.clear>x</button>
								{/if}
							</th>
						</Subscribe>
					{/each}
				</tr>
			</Subscribe>
		{/each}
	</thead>
	<tbody {...$tableBodyAttrs}>
		{#each $rows as row (row.id)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs rowProps={row.props()} let:rowProps>
				<tr id={row.id} {...rowAttrs}>
					{#each row.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
							<td {...attrs}>
								{JSON.stringify(attrs)}
								{JSON.stringify(props)}
								<Render of={cell.render()} />
							</td>
						</Subscribe>
					{/each}
				</tr>
			</Subscribe>
		{/each}
	</tbody>
</table>

<pre>{JSON.stringify(
		{
			alignments: $alignments,
			alignDefault: $alignDefault,
		},
		null,
		2,
	)}</pre>

<style>
	* {
		font-family: sans-serif;
	}
	pre {
		font-family: monospace;
	}

	table {
		border-spacing: 0;
		border-top: 1px solid black;
		border-left: 1px solid black;
	}

	th,
	td {
		margin: 0;
		padding: 0.5rem;
		border-bottom: 1px solid black;
		border-right: 1px solid black;
	}

	th {
		position: relative;
	}

	th .resizer {
		position: absolute;
		top: 0;
		bottom: 0;
		right: -4px;
		width: 8px;
		z-index: 1;
		background: lightgray;
		cursor: col-resize;
	}

	.sorted {
		background: rgb(144, 191, 148);
	}

	.matches {
		font-weight: 700;
	}

	.default-table-align label {
		padding: 0.1em 0.2em;
		border: 1px solid currentColor;
	}

	.group {
		background: rgb(144, 191, 148);
	}
	.aggregate {
		background: rgb(238, 212, 100);
	}
	.repeat {
		background: rgb(255, 139, 139);
	}

	.selected {
		background: rgb(148, 205, 255);
	}
</style>
