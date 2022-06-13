import { defineStore } from "pinia"
import { find, byId as uniqId, bySlug as uniqSlug, filter } from "geri"
import { createEndpoint } from "./createEndpoint"
import { ref, type UnwrapRef } from "vue"
import { type GygaxData } from "."

export function initState <T = Record<string, any>>(
	id: string,
	model: (i: GygaxData) => T,
	query: Record<any, any> = {},
	extend = (i: Record<string, any>) => i
) {
	return defineStore(`gygax-${id}`, () => {
		const items   = ref<T[]>([])
		const isReady = ref(false)

		function basicGetter <Y, T = Record<string, any>>(fn: (i: Y) => (j: T) => boolean) {
			return (x: Y): T|null => (find(fn(x))(items.value as T[]) ?? null) as T|null
		}
		const byId     = basicGetter<number, T>(uniqId)
		const bySlug   = basicGetter<string, T>(uniqSlug)
		const filterBy = (key: string, x: any) => filter((i: Record<string, any>) => i[key] === x)(items.value) as T[]

		createEndpoint<T>(id, model)(query).then(i => {
			items.value   = i as UnwrapRef<T>
			isReady.value = true
		})

		return extend({ items, isReady, byId, bySlug, filterBy })
	}, 
	{
		persist: {
			storage: window.sessionStorage
		}
	})
}

export default initState