import { type R, head } from "geri"
import { computed } from "vue"
import { createStore, type StoreContext, type CreateStoreOptions } from "./createStore"

export const createItemStore = <Item = R, Context = StoreContext<Item>>(
	options: CreateStoreOptions,
	extend: (i: StoreContext<Item>) => Context = i => i as unknown as Context
) => createStore<Item, Context>(
	{
		id: 'item',
		...options,
		fallback: options?.fallback ?? {}
	},
	context => {
		const data = computed<Item>(() => head<Item>(context.data.value) ?? options?.fallback ?? {})
		return extend({ ...context, data } as StoreContext<Item>)
	}
)

export default createItemStore