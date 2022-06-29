import { createNetlifyEndpoint, type EndpointMethodContext } from "mimir"
import { connect } from "./connect"
import { head, isEmpty, toLower, o, trim, type R } from "geri"
import bcrypt from "bcrypt"

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
		const getUser = async (query: R) => {
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

	const credentials = async (body: R, hash: boolean = false) => {
		const email    = o(trim, toLower)(body.email)
		const password = hash ? await bcrypt.hash(body.password, 10) : body.password
		return { email, password }
	}


	const get = ({ users, isAdmin, id, getUser, checkAuthority }: CTX) => {
		if (id) {
			checkAuthority()
			return getUser({ id })
		}
		if (!isAdmin) throw 'Lacks authorization'
		return users.select({})
	}
	const post = async ({ body, getUser }: CTX) => {
		const { email, password } = await credentials(body)
		const user = await getUser({ email })

		const correctPassword = await bcrypt.compare(password, user.password)
		if (!correctPassword) throw 'Wrong password'

		// Some JWT stuff...
		const token = ''

		return { user, token }
	}
	const put = async ({ users, body, isAdmin }: CTX) => {
		const { email, password } = await credentials(body, true)
		
		const userExists = !!((await users.select({ email }))?.length ?? 0)
		if (userExists) throw 'Email is already in use'
		
		const isVerified = isAdmin
		const isActive   = true
		
		await users.insert({ ...body, email, password, isVerified, isActive })

		return {}
	}
	const patch = async ({ users, getUser, checkAuthority, id, body }: CTX) => {
		checkAuthority()
		await getUser({ id })
		return users.update({ id }, body)
	}

	return createNetlifyEndpoint({ context, final, get, post, put, patch })
}

export default createEndpoint