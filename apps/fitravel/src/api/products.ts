import { connect } from "heimdall/ntl"
import { createAPI, createTable, type EndpointMethodContext } from "mimir"
import { head, map, o, type R } from "geri"

type CTX = EndpointMethodContext

//

const context = async (event: CTX) => {
	const { db, disconnect, bearer, authenticateToken } = await connect('fitravel')

	const token    = bearer(event.headers)
	const products = createTable(db, 'products')
	const id       = event.query?.id ?? 0
	const auth     = await authenticateToken(token)

	console.log('AUTH', auth)

	// const fuckOff = 'Þú hefur ekki réttindi fyrir þessa aðgerð'
	// const checkAdmin = () => {
	// 	if (auth.role !== 'admin') throw fuckOff
	// }
	// console.log('wut', token, auth, event.headers)
	// if (!auth.id) throw fuckOff

	return { ...event, disconnect, id, auth, products, checkAdmin: () => true }
}
const final = async ({ disconnect, results }: CTX) => {
	await disconnect()
	return results
}

//

const parseSchedule = (i: R) => {
	i.outbound = JSON.parse(i.outbound)
	i.inbound  = JSON.parse(i.inbound)
	return i
}
const stringifySchedule = (i: R) => {
	i.outbound = JSON.stringify(i.outbound)
	i.inbound = JSON.stringify(i.inbound)
	return i
}

const get = async ({ products, id, response }: CTX) => {
	if (id) {
		try {
			const item = head<R>(await products.select({ id })) ?? null
			if (!item) throw 'Tilboð fannst ekki'
			return o(response, parseSchedule)(item)
		}
		catch (e) { throw e }
	}
	const items = await products.select({})
	return o(response, map(parseSchedule))(items)
}
const patch = async ({ checkAdmin, id, body, auth, products, response }: CTX) => {
	checkAdmin()

	const item       = stringifySchedule(body)
	const dateFrom   = new Date(body?.dateFrom)
	const dateTo     = new Date(body?.dateTo)
	const modified   = new Date()
	const modifiedBy = auth.id

	await products.update({ id }, {
		...item, modified, modifiedBy, dateFrom, dateTo
	})

	return response({ message: 'Tilboð hefur verið uppfært' })
}
const put = async ({ checkAdmin, body, products, auth, response }: CTX) => {
	checkAdmin()

	const item       = stringifySchedule(body)
	const created    = new Date()
	const dateFrom   = new Date(body?.dateFrom)
	const dateTo     = new Date(body?.dateTo)
	const modified   = created
	const createdBy  = auth.id
	const modifiedBy = createdBy

	await products.insert({ ...item, dateFrom, dateTo, created, createdBy, modified, modifiedBy })

	return response({ message: 'Tilboð hefur verið stofnað' })
}

export const handler = createAPI({ context, final, get, patch, put, domain: '*' })