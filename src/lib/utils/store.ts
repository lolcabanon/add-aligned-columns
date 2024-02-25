import { readable, writable, type Readable, type Updater, type Writable } from 'svelte/store';

export type ReadOrWritable<T> = Readable<T> | Writable<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isReadable = <T>(value: any): value is Readable<T> => {
	return value?.subscribe instanceof Function;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isWritable = <T>(store: any): store is Writable<T> => {
	return store?.update instanceof Function && store.set instanceof Function;
};

export type WritableKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? Writable<T[K] | undefined> : Writable<T[K]>;
};

export type ReadableKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? Readable<T[K] | undefined> : Readable<T[K]>;
};

export type ReadOrWritableKeys<T> = {
	[K in keyof T]: T[K] extends undefined ? ReadOrWritable<T[K] | undefined> : ReadOrWritable<T[K]>;
};

export const Undefined = readable(undefined);
export const UndefinedAs = <T>() => Undefined as unknown as Readable<T>;

export interface ToggleOptions {
	clearOthers?: boolean;
}

export interface ArraySetStoreOptions<T> {
	isEqual?: (a: T, b: T) => boolean;
}

export interface ArraySetStore<T> extends Writable<T[]> {
	toggle: (item: T, options?: ToggleOptions) => void;
	add: (item: T) => void;
	remove: (item: T) => void;
	clear: () => void;
}

export const arraySetStore = <T>(
	initial: T[] = [],
	{ isEqual = (a, b) => a === b }: ArraySetStoreOptions<T> = {}
): ArraySetStore<T> => {
	const { subscribe, update, set } = writable(initial);
	const toggle = (item: T, { clearOthers = false }: ToggleOptions = {}) => {
		update(($arraySet) => {
			const index = $arraySet.findIndex(($item) => isEqual($item, item));
			if (index === -1) {
				if (clearOthers) {
					return [item];
				}
				return [...$arraySet, item];
			}
			if (clearOthers) {
				return [];
			}
			return [...$arraySet.slice(0, index), ...$arraySet.slice(index + 1)];
		});
	};
	const add = (item: T) => {
		update(($arraySet) => {
			const index = $arraySet.findIndex(($item) => isEqual($item, item));
			if (index === -1) {
				return [...$arraySet, item];
			}
			return $arraySet;
		});
	};
	const remove = (item: T) => {
		update(($arraySet) => {
			const index = $arraySet.findIndex(($item) => isEqual($item, item));
			if (index === -1) {
				return $arraySet;
			}
			return [...$arraySet.slice(0, index), ...$arraySet.slice(index + 1)];
		});
	};
	const clear = () => {
		set([]);
	};
	return {
		subscribe,
		update,
		set,
		toggle,
		add,
		remove,
		clear,
	};
};

export interface RecordSetStore<T extends string | number> extends Writable<Record<T, boolean>> {
	toggle: (item: T) => void;
	add: (item: T) => void;
	addAll: (items: T[]) => void;
	remove: (item: T) => void;
	removeAll: (items: T[]) => void;
	clear: () => void;
}

export const recordSetStore = <T extends string | number>(
	initial: Record<T, boolean> = {} as Record<T, boolean>
): RecordSetStore<T> => {
	const withFalseRemoved = (record: Record<T, boolean>): Record<T, true> => {
		return Object.fromEntries(Object.entries(record).filter(([, v]) => v)) as Record<T, true>;
	};
	const { subscribe, update, set } = writable(withFalseRemoved(initial));
	const updateAndRemoveFalse = (fn: Updater<Record<T, boolean>>) => {
		update(($recordSet) => {
			const newRecordSet = fn($recordSet);
			return withFalseRemoved(newRecordSet);
		});
	};
	const toggle = (item: T) => {
		update(($recordSet) => {
			if ($recordSet[item] === true) {
				delete $recordSet[item];
				return $recordSet;
			}
			return {
				...$recordSet,
				[item]: true,
			};
		});
	};
	const add = (item: T) => {
		update(($recordSet) => ({
			...$recordSet,
			[item]: true,
		}));
	};
	const addAll = (items: T[]) => {
		update(($recordSet) => ({
			...$recordSet,
			...Object.fromEntries(items.map((item) => [item, true])),
		}));
	};
	const remove = (item: T) => {
		update(($recordSet) => {
			delete $recordSet[item];
			return $recordSet;
		});
	};
	const removeAll = (items: T[]) => {
		update(($recordSet) => {
			for (const item of items) {
				delete $recordSet[item];
			}
			return $recordSet;
		});
	};
	const clear = () => {
		set({} as Record<T, true>);
	};
	return {
		subscribe,
		update: updateAndRemoveFalse,
		set: (newValue) => updateAndRemoveFalse(() => newValue),
		toggle,
		add,
		addAll,
		remove,
		removeAll,
		clear,
	};
};
