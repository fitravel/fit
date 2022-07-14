import { fetchEndpoint, type FetchEndpointOptions } from "mimir"
import { useAuth } from "./useAuth"
import { type R, omit } from "geri"
import { type Ref, ref } from "vue"

export type AuthFetchOptions = FetchEndpointOptions & { fallback?: any; ref?: Ref<any> }

export const createAuthFetch = (_options: AuthFetchOptions) => async (query: R = {}, data: R = {}) => {
	const { ref: REF = ref() } = _options ?? {}
	const auth = useAuth()
	await auth.isReady()
	const options = { ...omit([ 'ref', 'fallback' ])(_options), token: auth.token, query, data }
	REF.value = await fetchEndpoint(options).catch(error => _options?.fallback ?? null)
	return REF.value
}

export const createEndpoints = (endpoint: string, ref: Ref<any>, fallback: any, refresh?: () => Promise<any>) => {
	const _fetch = (method: string, options: Partial<AuthFetchOptions> = {}) => createAuthFetch({ method, endpoint, ...options })
	const fetch  = _fetch('GET', { endpoint, ref, fallback })
	const update = (query: R, data: R) => _fetch('PATCH', { endpoint })(query, data).then(() => (refresh ?? fetch)(query, data))
	const create = (data: R) => _fetch('PUT', { endpoint })({}, data).then(() => (refresh ?? fetch)({}, data))

	return { fetch, update, create }
}

export default createAuthFetch