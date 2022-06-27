import { createNetlifyEndpoint } from "mimir"
import { connect } from "./connect"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"

type CTX = EndpointMethodContext

export const createEndpoint = (database: string) => {
	const context = async (i: CTX) => {
		const { users, authenticate, disconnect, bearer } = await connect(database)

		const token   = bearer(i.headers)
		const auth    = await authenticate(token)
		const id      = i.query?.id ?? 0
		const isSelf  = id === auth.id
		const isAdmin = auth.role === 'admin'

		const checkAuthority = () => {
			const allowed = isSelf || isAdmin
			if (!allowed) throw 'Lacks authorization'
		}
		const getUser = async ({ query }) => {
			const user = head(await users.select(query)) ?? null
			if (!user) throw 'User not found'
			return user
		}
		return { ...i, token, users, auth, id, checkAuthority, getUser, isSelf, isAdmin, disconnect }
	}
	const final = async ({ results, disconnect }: CTX) => {
		await disconnect()
		return results
	}

	// HTTP METHODS

	const hashPass = (i) => bcrypt.hash(i, 10)

	const get = ({ users, isAdmin, id, getUser, checkAuthority }: CTX) => {
		if (id) {
			checkAuthority()
			return getUser({ id })
		}
		if (!isAdmin) throw 'Lacks authorization'
		return users.select({})
	}
	const post = async ({ payload, users, getUser }: CTX) => {
		const email    = o(trim, toLower)(payload.email)
		const password = await hashPass(payload.password)
		const user     = await getUser({ email })

		const correctPassword = await bcrypt.compare(password, user.password)
		if (!correctPassword) throw 'Wrong password'

		// Some JWT stuff...
		const token = ''

		return { user, token }
	}
	const put = async ({ users, payload, isAdmin }: CTX) => {
		const userExists = !isEmpty(await users.select({ email }))
		if (userExists) throw 'Email is already in use'
		
		const password   = await hashPass(payload.password)
		const isVerified = isAdmin

		return users.insert({ ...payload, password, isVerified })
	}
	const patch = async ({ users, getUser, checkAuthority, id, payload }: CTX) => {
		checkAuthority()
		await getUser({ id })
		return users.update({ id }, payload)
	}

	return createNetlifyEndpoint({ context, final, get, put, patch })
}

export default createEndpoint