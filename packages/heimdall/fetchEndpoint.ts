import { unrefProps, type R } from "geri"
import { stringify } from "qs"

//@ts-ignore
const api = import.meta.env.DEV ? 'http://localhost:9999/.netlify/functions/users' : 'https://fitravel.is/api/users'

export async function fetchEndpoint (method: string, query: R, payload: any, token = '') {
	const search  = stringify(unrefProps(query))
	const options = { method, headers: new Headers() } as R

	if (token) options.headers.append('Authorization', `Bearer ${token}`)
	if (method !== 'GET') options.body = JSON.stringify(unrefProps(payload))

	return fetch(`${api}?${search}`, options).then(async response => {
		const body = await response.json()
		if (response.status !== 200) throw body?.error ?? 'Það kom upp villa'
		return body
	})
}

export default fetchEndpoint

