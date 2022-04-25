import { defineStore } from "pinia"
import { find, byId, bySlug, map } from "fn"
import fetchEndpoint from "./fetchEndpoint"

export const basicGetter = <Y, T = Record<string, any>>(fn: (i: Y) => (j: T) => boolean) => {
	return (state: any) => (x: Y): T|null => (find(fn(x))(state.items as T[]) ?? null) as T|null
}

export function initState <T = Record<any, any>>(
	id: string, 
	model: (i: Record<any, any>) => T, 
	query: Record<any, any> = {}, 
	_extensions = {}
) {
	const extensions = { 
		state: {} as Record<any, any>, 
		getters: {} as { [i: string]: (state: any) => any; }, 
		actions: {} as { [i: string]: (...args: any[]) => any; }, 
		..._extensions 
	}
	return defineStore(`gygax-${id}`, { 
		state: () => ({ 
			items: [] as T[], 
			isReady: false, 
			...extensions.state 
		}), 
		getters: { 
			byId: basicGetter<number, T>(byId), 
			bySlug: basicGetter<string, T>(bySlug), 
			...extensions.getters 
		}, 
		actions: {
			async init () {
				const load   = await fetchEndpoint(id, query)
				//@ts-ignore
				this.items   = map(model)(load) as T[]
				this.isReady = true
			},
			...extensions.actions
		} 
	})
}

export default initState