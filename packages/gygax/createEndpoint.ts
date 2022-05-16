import { map } from "geri"
import { GygaxData } from "."
import fetchEndpoint from "./fetchEndpoint"

export function createEndpoint <T>(type: string, model: (i: GygaxData) => T) {
	return async (query: Record<string, any> = {}) => {
		const load = await fetchEndpoint(type, query)
		return map(model)(load)
	}
}

export default createEndpoint