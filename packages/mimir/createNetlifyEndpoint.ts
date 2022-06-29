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
export const handlerResponse = (status: number, body: any): HandlerResponse => ({ 
	statusCode: status, 
	body: JSON.stringify(body),
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json; charset=utf-8',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS, DELETE'
	}
})

export type EndpointMethodContext = Event & R & {
	success?: R|null
	error?: any
}
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
		let _status = 200, _body = null

		const response = (body: any, code: number = 200) => {
			_status = code
			_body   = body
		}
		const event   = refactorEvent(i)
		const context = await forContext({ ...event, response })
		const method  = methods[event.method as keyof EndpointMethods]

		try {
			if (!method) throw 'Unsupported method'
			await method(context)
		}
		catch (error) {
			await onError({ ...context, error })
		}
		finally {
			await onWrapUp(context)
			return handlerResponse(_status, _body)
		}
	} 
}

export default createNetlifyEndpoint