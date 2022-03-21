import { useOwners } from "gygax"
import { join } from "ramda"
import { stringify } from "qs"
import { config } from "."

export async function fetchEndpoint <T = Record<string, any>>(oid: number, type: string, actions: string[]|string, query: Record<string, any>) {
	const { token = '' } = useOwners().byId(oid) ?? {}
	const segments = Array.isArray(actions) ? join('/')(actions) : actions
	const url = `${config.baseURL}/${type}/${token}/is-IS/${segments}?${stringify(query)}`
	return fetch(url).then(i => i.json()) as Promise<T>
}

export default fetchEndpoint