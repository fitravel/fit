import { toJson } from "fn"
import { stringify } from "qs"
import config from "./gygax.config"

export function fetchEndpoint (endpoint: string, query: Record<any, any>) {
	return fetch(`${config.baseURL}/${endpoint}?${stringify({ per_page: 100, ...query })}`).then(toJson)
}

export default fetchEndpoint