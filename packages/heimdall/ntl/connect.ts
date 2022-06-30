import { connectToMaria, createTable } from "mimir"
import { epoch, last, o, split, type R, head } from "geri"
import jwt from "jsonwebtoken"

const secret = 'trallala'

export type UserRole = 'admin'|'reseller'|null
export interface AuthToken {
	id: number
	role: UserRole|null
	iat: number
	exp: number
}

export async function connect (database: string) {
	const db = await connectToMaria(database)

	const users      = createTable(db, 'heimdall-users')
	const tokens     = createTable(db, 'heimdall-tokens')
	const bearer     = (headers: R) => o(last, split(' '))(headers['authorization'] ?? '') as string
	const disconnect = () => db.end()

	const authenticateToken = async (token: string) => {
		if (token) {
			try {
				const { id = 0, role = null, iat = 0, exp = 0 } = (await jwt.verify(token, secret)) as AuthToken
				return { id, role, iat, exp } as AuthToken
			}
			catch (e) {
				throw 'Útrunnin/ógild aðgangsheimild'
			}
		}
		return { id: 0, role: null, iat: epoch(), exp: 0 }
	}
	const createToken = async (id: number, role: 'reseller'|'admin', isAuthToken = false) => {
		const iat  = epoch()
		const data = { id, role, iat }

		if (isAuthToken) {
			data.exp = iat + 60
		}
		return await jwt.sign(data, secret)
	}
	const refreshToken = async (userToken: string) => {
		const { id, role = null } = await authenticateToken(userToken)
		if (exp) throw 'Invalid token'
		return createToken(id, role, true)
	}
	const getUser = async (query: R, verify = false) => {
		const user = head<R>(await users.select(query)) ?? null
		if (!user) throw 'Aðgangsreikningur finnst ekki'
		
		if (verify) {
			const { isActive = false, isVerified = false } = user 
			if (!isActive) throw 'Þessi aðgangur er óvirkur'
			if (!isVerified) throw 'Þessi aðgangur hefur ekki verið staðfestur'
		}
		return user
	}

	return { users, tokens, disconnect, authenticateToken, createToken, refreshToken, bearer, getUser }
}

export default connect