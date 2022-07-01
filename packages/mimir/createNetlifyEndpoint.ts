import { type Handler, type HandlerEvent, type HandlerResponse } from "@netlify/functions"
import { type R, toLower } from "geri"
import { parse } from "qs"

export interface Event {
	query: R
	body: R
	method: string
	headers: {
    [name: string]: string | undefined;
	}
	event: R//HandlerEvent
}

export const refactorEvent = (event: HandlerEvent) => {
	const { 
		rawQuery = '',
		body: payload = null,
		httpMethod = 'GET',
		headers = {}
	} = event
	const method = toLower(httpMethod)
	const query  = parse(rawQuery)
	const body   = JSON.parse(`${payload}`)

	return { query, body, method, headers, event }
}
export const handlerResponse = (status: number, body: any, allowed = ''): HandlerResponse => ({ 
	statusCode: status, 
	body: JSON.stringify(body),
	headers: {
		'Access-Control-Allow-Origin': allowed ? allowed : '*',
		'Content-Type': 'application/json; charset=utf-8',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS, DELETE'
	}
})

export type EndpointMethodContext = Event & R
export type EndpointMethod = (i: EndpointMethodContext) => Promise<any>
export interface EndpointMethods {
	get?: EndpointMethod|null
	post?: EndpointMethod|null
	put?: EndpointMethod|null
	delete?: EndpointMethod|null
	patch?: EndpointMethod|null
	options?: EndpointMethod|null
}
export type EndpointConfig = EndpointMethods & {
	domain?: string
	context?: (i: EndpointMethodContext) => Promise<EndpointMethodContext>
	final?: (i: EndpointMethodContext) => Promise<EndpointMethodContext>
	error?: (i: EndpointMethodContext) => Promise<EndpointMethodContext>
} 

export function createNetlifyEndpoint (config: EndpointConfig): Handler {
	const methods: EndpointMethods = {
		get: config?.get ?? null,
		post: config?.post ?? null,
		put: config?.put ?? null,
		delete: config?.delete ?? null,
		patch: config?.patch ?? null,
		options: config?.options ?? (async () => 'OK') as EndpointMethod
	}
	const onError    = config?.error ?? (async ({ response, error }) => response({ message: 'Upp kom villa', error }, 500))
	const onWrapUp   = config?.final ?? (async () => {})
	const forContext = config?.context ?? (async i => i)

	return async (i: HandlerEvent) => {
		let _status = 200, _body = null, _context = {} as EndpointMethodContext

		const response = (body: any, code = 200) => {
			_status = code
			_body   = body
		}
		const event   = refactorEvent(i)
		const method  = methods[event.method as keyof EndpointMethods]
		const context = (toAdd: R) => _context = { ..._context, ...toAdd }

		const ctx = await forContext(event)
		try {
			context({ ...ctx, response })
			if (!method) throw 'Unsupported method'
			await method(_context)
		}
		catch (error) {
			context({ error })
			await onError(_context)
		}
		finally {
			await onWrapUp(_context)
			return handlerResponse(_status, _body, config?.domain ?? '')
		}
	} 
}

export default createNetlifyEndpoint