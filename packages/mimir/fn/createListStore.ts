import { type R, find as rfind, filter as rfilter, reject as rreject } from "geri"
import { createStore, type StoreContext, type CreateStoreOptions } from "./createStore"

type F = <T = R>(i: T) => boolean

interface ListStoreContext<T> extends StoreContext<T> {
	find: (fn: F) => T|null
	filter: (fn: F) => T[]
	reject: (fn: F) => T[]
}

export const createListStore = <Item = R, Context = ListStoreContext<Item>>(
	options: CreateStoreOptions,
	extend: (i: ListStoreContext<Item>) => Context = i => i as unknown as Context
) => createStore<Item, Context>(
	{
		id: 'list',
		...options
	},
	context => {
		const fn = <T>(hammer: (i: F, l: Item[]) => T) => (nail: F) => (hammer(nail, context.data.value) ?? null) as T

		const find   = fn<Item|null>(rfind)
		const filter = fn<Item[]>(rfilter)
		const reject = fn<Item[]>(rreject)

		return extend({ ...context, find, filter, reject } as ListStoreContext<Item>)
	}
)

export default createListStore