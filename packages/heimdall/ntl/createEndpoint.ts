import { createNetlifyEndpoint, type EndpointMethodContext } from "mimir"
import { connect } from "./connect"
import { head, toLower, o, trim, type R, pick, omit } from "geri"
import bcrypt from "bcrypt"

type CTX = EndpointMethodContext
	
export const createEndpoint = (database: string) => {
	const context = async (i: CTX) => {
		const { users, authenticateToken, disconnect, bearer, createToken, getUser } = await connect(database)

		const token     = bearer(i.headers)
		const auth      = await authenticateToken(token)
		const id        = i.query?.id ?? 0
		const isSelf    = id === auth.id
		const isAdmin   = auth.role === 'admin'
		const isRefresh = auth.id && !auth.role && !auth.iat

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
			return response(getUser({ id }))
		}
		if (!isAdmin) throw 'Notandi hefur ekki réttindi til að framkvæma þessa aðgerð'
		return response(await users.select({}))
	}
	const post = async ({ body, users, getUser, response, createToken, auth, isRefresh }: CTX) => {
		let user = { id: 0, token: '', password: '', role: '' }

		if (isRefresh) {
			user = await getUser({ id: auth.id })
		}
		else {
			const { email, password } = await credentials(body)
			user = await getUser({ email })

			const correctPassword = await bcrypt.compare(password, user.password)
			if (!correctPassword) throw 'Rangt lykilorð'

			if (!user.token) {
				const { id, role } = user
				const token = createToken({ id, role, iat: new Date().toString() })
				await users.update({ id }, { token })
				user = await getUser({ id })
			}
		}
		
		user = omit([ 'password', 'verifiedBy' ])(await getUser({ id }))
		const token = createToken(id, user.role)
		return response({ user, token })
	}
	const put = async ({ users, body, isAdmin, response }: CTX) => {
		const { email, password } = await credentials(body, true)
		
		const userExists = !!((await users.select({ email }))?.length ?? 0)
		if (userExists) throw 'Það er þegar til aðgangur skráður á þetta netfang'
		
		const isVerified = isAdmin
		const isActive   = true
		const created    = new Date()
		
		await users.insert({ ...body, email, password, isVerified, isActive, created })

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

	return createNetlifyEndpoint({ context, final, get, post, put, patch })
}

export default createEndpoint