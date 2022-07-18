import { createFetch, fetchEndpoint, type FetchFactoryOptions } from "mimir"
import { useAuth } from "./useAuth"

export const createSecureFetch = (options?: FetchFactoryOptions) => {
	const fetchFn = (fetchOptions: FetchFactoryOptions) => {
		const auth  = useAuth()
		const fetch = () => (options?.fetchFn ?? fetchEndpoint)({ ...options, ...fetchOptions, token: auth.token })
		const fail  = () => options?.fallback ?? null
		const retry = async () => { await auth.refresh(); return fetch().catch(fail) }
		
		return fetch().catch(retry)
	}
	return createFetch({ ...options, fetchFn })
}

export default createSecureFetch