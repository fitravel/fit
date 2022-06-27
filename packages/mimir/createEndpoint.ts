import { type Handler, type HandlerEvent, type HandlerResponse } from "@netlify/functions"
import { type R, toLower } from "geri"
import { parse } from "qs"

export interface Event {
	query: R
	payload: R
	method: string
	headers: {
    [name: string]: string | undefined;
	}
	token: string
	event: R//HandlerEvent
}

export const refactorEvent = <T = R>(event: HandlerEvent) => {
	const { 
		rawQuery = '',
		body = null,
		httpMethod = 'GET',
		headers = {}
	} = event
	const method  = toLower(httpMethod)
	const token   = headers?.Bearer ?? null
	const query   = parse(rawQuery)
	const payload = JSON.parse(body)

	return { query, payload, method, headers, token, event }
}
export const response = (status: number, payload: any) => ({ 
	statusCode: status, 
	body: JSON.stringify(payload),
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
export type EndpointMethod = <T = R>(i: EndpointMethodContext) => Promise<T>
export interface EndpointMethods {
	get?: EndpointMethod
	post?: EndpointMethod
	put?: EndpointMethod
	delete?: EndpointMethod
	patch?: EndpointMethod
	options?: EndpointMethod
}
export type EndpointConfig = EndpointMethods & {
	context?: (i: EndpointMethodContext) => Promise<EndpointMethodContext>
	final?: (i: EndpointMethodContext) => Promise<EndpointMethodContext>
	error?: (i: EndpointMethodContext) => Promise<EndpointMethodContext>
} 

export function createEndpoint (config: EndpointConfig): Handler {
	const methods = {
		get: config?.get ?? null,
		post: config?.post ?? null,
		put: config?.put ?? null,
		delete: config?.delete ?? null,
		patch: config?.patch ?? null,
		options: config?.options ?? (() => 'OK')
	}
	const orError    = config?.error ?? (async i => i.error)
	const onWrapUp   = config?.final ?? (async i => i.results)
	const forContext = config?.context ?? (async i => i)

	return async (i: HandlerEvent) => {
		let status = 500, results = null

		const event   = refactorEvent(i)
		const context = await forContext(event)
		const method  = methods[event.method]

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