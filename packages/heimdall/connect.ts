import { connectToMaria, createTable } from "mimir"
import { last, o, split, type R } from "geri"
import { addMinutes } from "date-fns"
import jwt from "jsonwebtoken"

const secret = 'trallala'

export type UserRole = 'admin'|'reseller'|null
export interface TokenAuth {
	id: number
	role: UserRole

}

export async function connect (database: string) {
	const db = await connectToMaria(database)

	const users      = createTable(db, 'heimdall-users')
	const tokens     = createTable(db, 'heimdall-tokens')
	const bearer     = (headers: R) => o(last, split(' '))(headers['authorization'] ?? '') as string
	const disconnect = db.end

	const authenticate = async (token: string) => {
		try {
			return await jwt.verify(token, secret) as TokenAuth
		}
		catch {
			return { id: 0, role: null, eat: 0 }
		}
	}
	const generate = async (id: number, role: 'reseller'|'admin' = 'reseller') => {
		const eat = addMinutes(new Date(), 1)
		return jwt.sign({ id, role, eat }, secret)
	}

	return { users, tokens, disconnect, authenticate, generate, bearer }
}

export default connect