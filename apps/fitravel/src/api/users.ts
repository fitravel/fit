import { createEndpoint, EndpointMethod, type EndpointMethodContext } from "mimir"
import { type R, head, join, toPairs, compose, map, is, o } from "geri"
import { createConnection, type ConnectionConfig } from "mariadb"

const connect = () => createConnection({
	database: 'hermes',
	host: 'dox.cyt9y0dbi3wv.eu-west-1.rds.amazonaws.com',
	user: 'admin',
	password: 'CovidSokkar2021!',
	connectTimeout: 10000
})

async function createTable ({
	table = ''
}) {
	const db = await connect()

	const where = (query: R) => {
		const AND = join(' AND ')
		const toString = ([ key, i ]: [string, any]) => {
			const value = (i: any, operator: string = '='): string => {
				if (is(String)(i)) return `${operator}'${i}'`
				if (is(Object)(i)) return compose(AND, map(([ x, y ]) => i + value(y, x)), toPairs)(i)
				return `${operator}${i}`
			}
			return key + value(i)
		}
		return compose(AND, map(toString), toPairs)(query)
	}
	const select = (query: R, _fields: string[]|null = null) => {
		const fields = _fields ? join(', ')(_fields) : '*'
		const sql    = `SELECT ${fields} FROM ${table}${where(query)}`

		return db.query({ sql })
	}

	const insert = () => {

	}
	const update = () => {

	}

	return { select, insert, update }
}

//

type CTX = EndpointMethodContext

const context = async (i: CTX) => {
	const users   = await {}
	const auth    = await users.authenticate(i.token)
	const id      = i.query?.id ?? 0
	const isSelf  = id === auth.id
	const isAdmin = auth.role === 'admin'

	const checkAuthority = () => {
		const allowed = isSelf || isAdmin
		if (!allowed) throw 'Lacks authorization'
	}
	const getUser = async () => {
		checkAuthority()

		const user = head(await users.select({ id })) ?? null
		if (!user) throw 'User not found'

		return user
	}

	return { ...i, users, auth, id, checkAuthority, getUser, isSelf, isAdmin }
}
const final = async ({ results, users }: CTX) => {
	await users.end()
	return results
}

const get = ({ users, isAdmin, id, getUser }: CTX) => {
	if (id) return getUser()
	if (!isAdmin) throw 'Lacks authorization'
	return users.select({})
}
const put = ({ users, payload, isAdmin }: CTX) => {
	return users.insert({ ...payload, isVerified: isAdmin })
}
const patch = async ({ users, getUser, id, payload }: CTX) => {
	await getUser()
	return users.update({ id }, payload)
}

export default createEndpoint({ context, final, get, put, patch })