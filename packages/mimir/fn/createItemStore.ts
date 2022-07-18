import { type R, head } from "geri"
import { computed, type Ref } from "vue"
import { createStore, type StoreContext, type CreateStoreOptions } from "./createStore"

export interface ItemStoreContext<T = R> extends Omit<StoreContext<T>, 'data'|'get'> {
	data: Ref<T>
	get: (id: number) => Promise<T>
}

export const createItemStore = <Item = R, Context = ItemStoreContext<Item>>(
	options: CreateStoreOptions,
	extend: (i: ItemStoreContext<Item>) => Context = i => i as unknown as Context
) => createStore<Item, Context>(
	{
		id: 'item',
		...options,
		fallback: (options?.fallback ?? {}) as Item
	},
	context => {
		const data = computed<Item>(() => {
			console.log('d',context.data.value)
			return head<Item>(context.response.value) ?? options?.fallback ?? {}
		})
		const get  = (id: number): Promise<Item> => context.get({ id }).then(() => {
			console.log('then', data.value, context.data.value)
			return data.value
		})

		return extend({ ...context, data, get } as ItemStoreContext<Item>)
	}
)

export default createItemStore