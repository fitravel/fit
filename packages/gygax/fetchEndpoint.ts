import { stringify } from "qs"
import { config } from "."

export function fetchEndpoint (endpoint: string, query: Record<any, any>) {
	return fetch(`${config.baseURL}/${endpoint}?${stringify({ per_page: 100, ...query })}`).then(i => i.json())
}

export default fetchEndpoint