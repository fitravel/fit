import { fetchEndpoint, type FetchEndpointOptions } from "./fetchEndpoint"
import { type R } from "geri"
import { type Ref, ref } from "vue"

export type FetchFactoryOptions = Partial<
	FetchEndpointOptions & { 
		fallback?: any
		fetchFn?: (options: FetchEndpointOptions) => Promise<any>
		fetchRef?: Ref<any>
		loadingRef?: Ref<boolean>
	}
>

const withLoader = async (r: Ref<boolean>, fn: () => Promise<any>) => {
	r.value = true
	const x = await fn()
	r.value = false
	return x
}

export const createFetch = (options?: FetchFactoryOptions) => {
	const { endpoint = '', method = 'GET', config = {}, fetchFn = fetchEndpoint,
		fetchRef = ref(options?.fallback), loadingRef = ref(false) } = options ?? {}

	return async (query: R = {}, data: R = {}) => {
		const fetch = () => fetchFn({ method, endpoint, config, query, data })
		return fetchRef.value = await withLoader(loadingRef, fetch)
	}
}

export default createFetch