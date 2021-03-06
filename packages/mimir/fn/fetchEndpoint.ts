import { toUpper, unrefProps, type R } from "geri"
import qs from "qs"

export interface FetchEndpointOptions {
	endpoint?: string
	method?: string
	query?: R
	data?: any
	token?: string
	config?: R
}
const baseURL = 'fitravel.is'
export async function fetchEndpoint (options: FetchEndpointOptions) {
	const { token = '', query = {}, endpoint = '' } = options

	const method  = toUpper(options?.method ?? 'GET')
	const search  = qs.stringify(unrefProps(query))
	const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' })
	const config  = { method, headers, ...options.config } as R

	if (token) config.headers.append('Authorization', `Bearer ${token}`)
	if (config.method !== 'GET') config.body = JSON.stringify(unrefProps(options.data))

	//@ts-ignore
	const url = import.meta.env.DEV ?? false ? `http://localhost:9999/.netlify/functions/${endpoint}` : `https://${baseURL}/api/${endpoint}`

	return fetch(`${url}?${search}`, config).then(async response => {
		const data = await response.json()
		if (response.status !== 200) throw data?.error ?? 'Það kom upp villa'
		return data
	})
}

// export const get = (endpoint: string, query: R = {}, options: ) => fetchEndpoint({ method: 'GET', endpoint, query })

// const { get, post, patch, put } = fetchUsers()

// await get('/users', {})
// await post('/users', {}, {})
// await patch('/users', { id }, { isActive: false })
// await put('/users', {})

export default fetchEndpoint

