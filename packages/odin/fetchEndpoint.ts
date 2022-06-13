import { useOwners } from "gygax"
import { join, type R, head, tail, omit, o, unrefProps } from "geri"
import { stringify } from "qs"
import config from "./config"

export async function fetchEndpoint <T = Record<string, any>>(
	url = (query: R, guid = '') => {

		const type     = head(query?.actions ?? [])
		const segments = o(join('/'), tail)(query?.actions ?? [])

		return `${type}/${guid}/${segments}/`
	},
	query = () => ({})
) {
	const q = unrefProps(query())
	const s = stringify(omit([ 'oid', 'actions' ])(q))
	const { byId } = useOwners()
	const { token: guid = '' } = byId(q?.oid)

	return fetch(`${config.baseURL}/${url(q, guid)}?${s}`).then(i => i.json()) as Promise<T>
}

export default fetchEndpoint