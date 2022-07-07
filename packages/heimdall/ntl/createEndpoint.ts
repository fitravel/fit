import { createAPI, type EndpointMethodContext } from "mimir/ntl"
import { connect } from "./connect"
import { take, takeLast, toLower, o, trim, type R, omit } from "geri"
import bcrypt from "bcrypt"

type CTX = EndpointMethodContext
	
export const createEndpoint = (domain: string, database: string) => {
	const context = async (i: CTX) => {
		const { users, authenticateToken, disconnect, bearer, createToken, getUser } = await connect(database)
		
		const token     = bearer(i.headers)
		const auth      = await authenticateToken(token)
		const id        = i.query?.id ?? 0
		const isSelf    = auth.exp && id === auth.id
		const isAdmin   = auth.exp && auth.role === 'admin'
		const isRefresh = auth.id && !auth.exp

		const checkAuthority = () => {
			const allowed = isSelf || isAdmin
			if (!allowed) throw 'Notandi hefur ekki réttindi til að framkvæma þessa aðgerð'
		}
		
		return { ...i, token, users, auth, id, checkAuthority, getUser, isSelf, isAdmin, disconnect, createToken, isRefresh }
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

	const get = async ({ users, isAdmin, id, getUser, checkAuthority, response }: CTX) => {
		if (id) {
			checkAuthority()
			return response(await getUser({ id }))
		}
		if (!isAdmin) throw 'Notandi hefur ekki réttindi til að framkvæma þessa aðgerð'
		return response(await users.select({}))
	}
	const post = async ({ body, users, getUser, response, createToken, auth, isRefresh }: CTX) => {
		if (isRefresh) {
			const user  = await getUser({ id: auth.id }, true)
			const token = await createToken(user.id, user.role, true)

			return response({ token })
		}
		const { email, password } = await credentials(body)
		let user = await getUser({ email }, true)

		const correctPassword = await bcrypt.compare(password, user.password)
		if (!correctPassword) throw 'Rangt lykilorð'

		if (!user.token) {
			const { id, role } = user
			const token = await createToken(id, role)
			await users.update({ id }, { token })
			user = await getUser({ id }, true)
		}
		user = omit([ 'password', 'verifiedBy' ])(user)
		return response(user)
	}
	const put = async ({ users, body, isAdmin, response }: CTX) => {
		const { email, password } = await credentials(body, true)
		
		const userExists = !!((await users.select({ email }))?.length ?? 0)
		if (userExists) throw 'Það er þegar til aðgangur skráður á þetta netfang'
		
		const isVerified = isAdmin
		const created    = new Date()
		const registry   = `${take(6)(body.registry)}${takeLast(4)(body.registry)}`
		const licence    = `${take(4)(body.licence)}-${takeLast(3)(body.licence)}`
		
		await users.insert({ ...body, email, password, isVerified, created, registry, licence })

		const message = `Aðgangur hefur verið stofnaður á netfang ${email}` + (
			isAdmin ? '' : ' — Athugaðu að það þarf að staðfesta aðganginn áður en hann verður virkur, sem getur tekið 1-2 virka daga'
		)
		return response({ message })
	}
	const patch = async ({ users, getUser, checkAuthority, id, body, response }: CTX) => {
		checkAuthority()
		await getUser({ id })
		await users.update({ id }, body)
		return response({})
	}

	return createAPI({ domain, context, final, get, post, put, patch })
}

export default createEndpoint