import { connectToMaria } from "mimir"
import { last, o, split } from "geri"
import { addMinutes } from "date-fns"
import jwt from "jsonwebtoken"

const secret = 'trallala'

export async function connect (database: string) {
	const db = await connectToMaria(database)

	const users      = createTable(db, 'heimdall-users')
	const tokens     = createTable(db, 'heimdall-tokens')
	const bearer     = (headers) => o(last, split(' '))(headers['authorization'] ?? '')
	const disconnect = db.end

	const authenticate = async (token: string) => {
		return jwt.verify(token, secret).catch(i => null)
	}
	const generate = async (id: number, role: 'reseller'|'admin' = 'reseller') => {
		const eat = addMinutes(new Date(), 1)
		return jwt.sign({ id, role, eat }, secret)
	}

	return { users, tokens, disconnect }
}

export default connect