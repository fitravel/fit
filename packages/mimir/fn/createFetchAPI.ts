import { type Ref, ref, computed } from "vue"
import { type R } from "geri"
import { type FetchFactoryOptions, createFetch } from "./createFetch"

export type CreateFetchApiOptions = FetchFactoryOptions & {
	dataRef?: Ref<any[]>
	messageRef?: Ref<{ message: string }>
	loadingRef?: Ref<boolean>
	errorRef?: Ref<any>
	fetchFactory?: (i: FetchFactoryOptions) => (q?: R, d?: R) => Promise<any>
	fallback?: any
}
export type GetFetch   = (q?: R) => Promise<R[]>
export type PostFetch  = (q?: R, d?: R) => Promise<any>
export type PatchFetch = (q: R, d: R) => Promise<{ message: string }>
export type PutFetch   = (d: R) => Promise<{ message: string }>

export interface FetchAPI {
	data: Ref<any>
	isLoading: Ref<boolean>
	get: GetFetch
	post: PostFetch
	patch: PatchFetch
	put: PutFetch
	message: Ref<string>
	error: Ref<string>
	isError: Ref<boolean>
}
export const createFetchAPI = (options: CreateFetchApiOptions): FetchAPI => {
	const { dataRef = ref([]), messageRef = ref({ message: '' }), 
		loadingRef = ref(true), errorRef = ref(null)} = options

	const fetch = (method: string, fetchRef: Ref<any>) => {
		const fn = options?.fetchFactory ?? createFetch
		return fn({ ...options, method, fetchRef, loadingRef })
	}
	const get   = (query?: R) => fetch('GET', dataRef)(query)
	const post  = (query?: R, data?: R) => fetch('POST', messageRef)(query, data)
	const patch = (query: R, data: R) => fetch('PATCH', messageRef)(query, data)
	const put   = (data: R) => fetch('PUT', messageRef)({}, data)

	const data      = computed(() => dataRef.value)
	const message   = computed(() => messageRef.value?.message ?? '')
	const isLoading = computed(() => loadingRef.value)
	const error     = computed(() => errorRef.value?.message ?? '')
	const isError   = computed(() => !!errorRef.value)

	return { 
		data, message, isLoading, 
		get, post, patch, put, 
		error, isError 
	}
}

export default createFetchAPI