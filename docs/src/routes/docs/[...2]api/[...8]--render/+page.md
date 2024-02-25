---
title: Render
description: Render a Svelte component configured as a render config
sidebar_title: Render
---

<script>
  import { Render, createRender } from 'svelte-headless-table';
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`<Render/>` provides more control and complexity when rendering Svelte components. It is used in conjuction with `createRender` to define custom components for headers, footers, and data cells.

## Usage

---

`<Render/>` takes a single prop `of` with `RenderConfig` type.

---

### `RenderConfig`

`RenderConfig` can either be:

1. a `string` or `number` for static content
2. a `Readable<string>` or `Readable<number>` for dynamic content
3. a `ComponentRenderConfig` returned from `createRender` for Svelte component content

:::admonition type="note"
`ComponentRenderConfig` can either be static or dynamic depending on its prop type. See also [`createRender`](create-render.md).
:::

---

### `Render#of: string | number`

Renders a simple text node.

```svelte
<Render of="Hello, world" />
```

<code>
  <Render of="Hello, world" />
</code>

---

### `Render#of: Readable<string | number>`

Renders a simple reactive text node.

```svelte
<script>
  const pageY = writable(0);
</script>

<svelte:window bind:scrollY={$pageY} />
<Render of={pageY} />
```

<script>
  import { writable } from 'svelte/store';
  const pageY = writable(0);
</script>

<svelte:window bind:scrollY={$pageY} />

<code>
  <Render of={pageY} />
</code>

---

### `Render#of: ComponentRenderConfig`

Renders a Svelte component with props. `ComponentRenderConfig` is created with [`createRender`](create-render.md).

```svelte
<script>
  import Profile from './Profile.svelte';
  const profile = createRender(Profile, {
    name: 'Alan Turing'
  });
</script>

<Render of={profile} />
```

<script>
  import Profile from '../[...7]create-render/Profile.svelte';
  const profile = createRender(Profile, { name: 'Alan Turing' });
</script>

<Render of={profile} />
