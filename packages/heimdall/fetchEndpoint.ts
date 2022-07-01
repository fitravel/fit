import { unrefProps, type R } from "geri"
import { stringify } from "qs"

//@ts-ignore
const api = import.meta.env.DEV ? 'http://localhost:9999/.netlify/functions/users' : 'https://spiffy-arithmetic-4222e4.netlify.app/api/users'

export async function fetchEndpoint (method: string, query: R, payload: any, token = '') {
	const search  = stringify(unrefProps(query))
	const body    = method === 'GET' ? undefined : JSON.stringify(unrefProps(payload))
	const headers = new Headers()

	if (token) headers.append('Authorization', `Bearer ${token}`)

	return fetch(`${api}?${search}`, { method, body, headers }).then(async response => {
		const body = await response.json()
		if (response.status !== 200) throw body?.error ?? 'Það kom upp villa'
		return body
	})
}

export default fetchEndpoint

