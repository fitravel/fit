import { connectToMaria, createTable } from "mimir"
import { isNil, last, o, split, type R, head } from "geri"
import { isAfter, addMinutes } from "date-fns"
import jwt from "jsonwebtoken"

const secret = 'trallala'

export type UserRole = 'admin'|'reseller'|null
export interface TokenAuth {
	id: number
	role?: UserRole
	iat?: string|Date
}

export async function connect (database: string) {
	const db = await connectToMaria(database)

	const users      = createTable(db, 'heimdall-users')
	const tokens     = createTable(db, 'heimdall-tokens')
	const bearer     = (headers: R) => o(last, split(' '))(headers['authorization'] ?? '') as string
	const disconnect = () => db.end()

	const authenticateToken = async (token: string, refresh: boolean = false) => {
		if (token) {
			const { id = null, role = null, iat = null } = await jwt.verify(token, secret)
			if ((refresh && !id) || (!refresh && (!role || !iat || !id))) throw 'Brengluð aðgangsheimild'
			if (!refresh && isAfter(new Date(), addMinutes(new Date(iat), 1))) throw 'Útrunnin aðgangsheimild'
			return { id, role, iat } as TokenAuth
		}
		return { id: 0, role: null, iat: null }
	}
	const createToken = async (id: number, role?: 'reseller'|'admin') => {
		const sign = (data: R) => jwt.sign(data, secret)
		const iat = new Date().toString()
		return isNil(role) ? sign({ id, role, iat }) : sign({ id })
	}
	const refreshToken = async (refresh: string) => {
		const { id, role = null, iat = null } = await authenticateToken(refresh)
		if (role || iat) throw 'Illegal token'
		const user = getUser({ id })
	}
	const getUser = async (query: R) => {
		const user = head<R>(await users.select(query)) ?? null
		if (!user) throw 'Það fannst enginn aðgangur skráður á þetta netfang'
		
		const { isActive = false, isVerified = false } = user 
		if (!isActive) throw 'Þessi aðgangur er óvirkur'
		if (!isVerified) throw 'Þessi aðgangur hefur ekki verið staðfestur'

		return user
	}

	return { users, tokens, disconnect, authenticateToken, createToken, refreshToken, bearer, getUser }
}

export default connect