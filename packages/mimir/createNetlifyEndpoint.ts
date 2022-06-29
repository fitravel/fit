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
export const response = (status: number, body: any) => ({ 
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
	const onError    = config?.error ?? (async i => i.error)
	const onWrapUp   = config?.final ?? (async i => i.results)
	const forContext = config?.context ?? (async i => i)

	return async (i: HandlerEvent): HandlerResponse => {
		let status = 500, results = null

		const event   = refactorEvent(i)
		const context = await forContext(event)
		const method  = methods[event.method as keyof EndpointMethods]

		try {
			if (!method) throw 'Unsupported method'
			results = await method(context)
			status  = 200
		}
		catch (error) {
			results = await onError({ ...context, error })
		}
		finally {
			results = await onWrapUp({ ...context, status, results })
			return response(status, results)
		}
	}
}

export default createNetlifyEndpoint