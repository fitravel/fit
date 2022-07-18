import { defineStore } from "pinia"
import { ref, type Ref } from "vue"
import { type R } from "geri"
import { createFetchAPI, type FetchAPI, type GetFetch, type CreateFetchApiOptions } from "mimir"

export type FetchFn = (query?: R, data?: R) => Promise<any>
export interface CreateStoreOptions {
	endpoint: string
	id?: string
	apiFactory?: (options: CreateFetchApiOptions) => FetchAPI
	fallback?: any
	model?: (data: any) => any
}
export interface StoreContext<T> extends FetchAPI {
	response: Ref<T[]>
}

export const createStore = <Item = R, Context = StoreContext<Item>>(
	options: CreateStoreOptions,
	extend: (i: StoreContext<Item>) => Context = i => i as unknown as Context
) => {
	const { id = 'store', endpoint, fallback = null, apiFactory = createFetchAPI } = options
	return defineStore(`${endpoint}-${id}`, () => {
		const response = ref(fallback)
		const api = apiFactory({ fetchRef: response, endpoint, fallback })
		return extend({ response, ...api } as StoreContext<Item>) as Context
	})
}

export default createStore