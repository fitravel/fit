import { defineStore } from "pinia"
import { find, byId, bySlug } from "geri"
import { createEndpoint } from "./createEndpoint"
import { reactive } from "vue"
import { type GygaxData } from "."

export const basicGetter = <Y, T = Record<string, any>>(fn: (i: Y) => (j: T) => boolean) => {
	return (state: any) => (x: Y): T|null => (find(fn(x))(state.items as T[]) ?? null) as T|null
}

export function initState <T = Record<string, any>>(
	id: string, 
	model: (i: GygaxData) => T, 
	query: Record<any, any> = {}, 
	_extensions = {}
) {
	const extensions = { 
		state: {} as Record<string, any>, 
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
				this.items   = reactive(await createEndpoint<T>(id, model)(query))
				this.isReady = true
			},
			...extensions.actions
		} 
	})
}

export default initState