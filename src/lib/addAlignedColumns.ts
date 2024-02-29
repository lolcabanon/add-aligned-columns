import type {
  NewTableAttributeSet,
  NewTablePropSet,
  TablePlugin
} from 'svelte-headless-table/plugins';
import { derived, get, writable, type Writable } from 'svelte/store';

export interface AddAlignedColumnsConfig {
  defaultAlignment?: ColumnAlignment;
  toggleOrder?: ColumnAlignment[];
  alignmentType?: AlignmentType;
  defaultToggle?: boolean;
  defaultDisable?: boolean;
}

export interface AlignmentKey {
  id: string;
  alignment: ColumnAlignment;
}

const DEFAULT_TOGGLE_ORDER: ColumnAlignment[] = [
  'auto',
  'left',
  'center',
  'right'
];

export type ColumnAlignment = 'auto' | 'left' | 'center' | 'right';

export type AlignFlex = 'normal' | 'flex-start' | 'center' | 'flex-end';

export type AlignmentSpan = 'thead' | 'tbody';

export type AlignmentType = 'prop' | 'text' | 'flex';

export type AlignedColumnsState = {
  alignments: Writable<Record<string, ColumnAlignment | undefined>>;
  alignDefault: Writable<ColumnAlignment>;
};

export type AlignedColumnsColumnOptions = {
  initialAlignment?: ColumnAlignment;
  alignOn?: AlignmentSpan | AlignmentSpan[];
  noToggle?: boolean;
  disable?: boolean;
};

export type AlignedColumnsPropSet = NewTablePropSet<{
  'thead.tr.th': {
    alignment?: ColumnAlignment;
    toggle: (node: Element) => void;
    clear: (node: Element) => void;
    noToggle?: boolean;
    disabled: boolean;
  };
  'tbody.tr.td': {
    alignment?: ColumnAlignment;
    disabled: boolean;
  };
}>;

export type AlignedColumnsAttributeSet = NewTableAttributeSet<{
  'thead.tr.th': {
    style?: {
      'text-align'?: ColumnAlignment;
      'justify-content'?: AlignFlex;
    };
  };
  'tbody.tr.td': {
    style?: {
      'text-align'?: ColumnAlignment;
      'justify-content'?: AlignFlex;
    };
  };
}>;

const flexAlignMap: Record<ColumnAlignment, AlignFlex> = {
  auto: 'normal',
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
};

type ColumnsAlignmentState = Record<string, ColumnAlignment | undefined>;

export const addAlignedColumns =
  <Item>({
    defaultAlignment = 'auto',
    toggleOrder = DEFAULT_TOGGLE_ORDER,
    alignmentType = 'prop',
    defaultToggle = true,
    defaultDisable = false
  }: AddAlignedColumnsConfig): TablePlugin<
    Item,
    AlignedColumnsState,
    AlignedColumnsColumnOptions,
    AlignedColumnsPropSet,
    AlignedColumnsAttributeSet
  > =>
  ({ columnOptions }) => {
    const shouldDisable = (colDisable: boolean | undefined): boolean =>
      colDisable !== undefined ? colDisable : defaultDisable;

    const shouldToggle = (colNoToggle: boolean | undefined): boolean =>
      colNoToggle !== undefined ? !colNoToggle : defaultToggle;

    const initialAlignments = Object.fromEntries(
      Object.entries(columnOptions).map(
        ([columnId, { initialAlignment, disable }]) => [
          columnId,
          shouldDisable(disable)
            ? undefined
            : initialAlignment ?? defaultAlignment
        ]
      )
    );

    const alignDefault = writable(defaultAlignment);

    const columnsAlignments =
      writable<ColumnsAlignmentState>(initialAlignments);

    // ! `initialAlignments` follows `columnsAlignments` updates, how do i stop that ??
    const ogAlignments = structuredClone(initialAlignments);

    const pluginState: AlignedColumnsState = {
      alignments: columnsAlignments,
      alignDefault
    };

    return {
      pluginState,
      columnOptions, // ? needed or useful ?
      hooks: {
        'thead.tr.th': (cell) => {
          const { noToggle, alignOn, disable } = columnOptions[cell.id] ?? {};

          const onToggle = (e: Event) => {
            e.stopPropagation();

            const findNext = (
              currentAlignment: ColumnAlignment | undefined
            ) => {
              const currentIndex = toggleOrder.findIndex(
                (alignment) => alignment === currentAlignment
              );

              if (currentIndex < toggleOrder.length - 1)
                return toggleOrder[currentIndex + 1];

              const initialAlignment =
                columnOptions[cell.id]?.initialAlignment ?? get(alignDefault);
              return initialAlignment && toggleOrder.includes(initialAlignment)
                ? toggleOrder[0]
                : initialAlignment;
            };

            columnsAlignments.update((ca) => {
              const currentAlignment = ca[cell.id];
              // if (currentAlignment !== undefined) {
              ca[cell.id] = findNext(currentAlignment);
              // }

              return ca;
            });
          };

          const onClear = (e: Event) => {
            e.stopPropagation();

            columnsAlignments.update((ca) => {
              ca[cell.id] = ogAlignments[cell.id];

              return ca;
            });
          };

          const props = derived(
            [columnsAlignments, alignDefault],
            ([$columnsAlignments, $alignDefault]) => {
              const toggle = (node: Element) => {
                if (!shouldToggle(noToggle)) return;

                node.addEventListener('click', onToggle);
                return {
                  destroy() {
                    node.removeEventListener('click', onToggle);
                  }
                };
              };
              const clear = (node: Element) => {
                if (!shouldToggle(noToggle)) return;

                node.addEventListener('click', onClear);
                return {
                  destroy() {
                    node.removeEventListener('click', onClear);
                  }
                };
              };

              const alignment = shouldDisable(disable)
                ? undefined
                : $columnsAlignments[cell.id] ?? $alignDefault;

              return {
                alignment,
                toggle,
                clear,
                noToggle: !shouldToggle(noToggle) || shouldDisable(disable),
                disabled: shouldDisable(disable)
              };
            }
          );

          const attrs = derived(
            [columnsAlignments, alignDefault],
            ([$columnsAlignments, $alignDefault]) => {
              const alignment = shouldDisable(disable)
                ? undefined
                : $columnsAlignments[cell.id] ?? $alignDefault;

              return (!alignOn ||
                alignOn === 'thead' ||
                alignOn?.includes('thead')) &&
                alignment
                ? {
                    style: {
                      'text-align':
                        alignmentType === 'text' ? alignment : undefined,
                      'justify-content':
                        alignmentType === 'flex'
                          ? flexAlignMap[alignment]
                          : undefined
                    }
                  }
                : {};
            }
          );
          return { props, attrs };
        },
        'tbody.tr.td': (cell) => {
          const { alignOn, disable } = columnOptions[cell.id] ?? {};

          const props = derived(
            [columnsAlignments, alignDefault],
            ([$columnsAlignments, $alignDefault]) => {
              const alignment = shouldDisable(disable)
                ? undefined
                : $columnsAlignments[cell.id] ?? $alignDefault;

              return {
                alignment,
                disabled: shouldDisable(disable)
              };
            }
          );

          const attrs = derived(
            [columnsAlignments, alignDefault],
            ([$columnsAlignments, $alignDefault]) => {
              const alignment = shouldDisable(disable)
                ? undefined
                : $columnsAlignments[cell.id] ?? $alignDefault;

              console.log('alignment', alignment);

              console.log('derived td attrs');

              return (!alignOn ||
                alignOn === 'tbody' ||
                alignOn?.includes('tbody')) &&
                alignment
                ? {
                    style: {
                      'text-align':
                        alignmentType === 'text' ? alignment : undefined,
                      'justify-content':
                        alignmentType === 'flex'
                          ? flexAlignMap[alignment]
                          : undefined
                    }
                  }
                : {};
            }
          );
          return { props, attrs };
        }
      }
    };
  };
