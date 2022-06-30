import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { byId, filter, find, key, reject, type R } from "geri"
import fetchEndpoint from "./fetchEndpoint"
import useAuth from "./useAuth"


export const useUsers = defineStore('heimdall-users', () => {
	const users = ref([] as R[])

	const reduced    = (fn: any, args = () => [ key('isVerified') ] as any[]) => computed(() => fn(...args())(users.value))
	const verified   = reduced(filter)
	const unverified = reduced(reject)

	const fetch = async () => {
		const auth = useAuth()
		users.value = await fetchEndpoint('GET', {}, {}, auth.token).catch(error => {
			console.log(error)
			return []
		})
	}
	const update = async (query: R, data: R) => {
		const auth = useAuth()
		await fetchEndpoint('PATCH', query, data, auth.token)
		return fetch()
	}
	const toggle = async (id: number) => {
		let { isActive = false } = find<R>(byId(id))(verified.value) ?? {}
		isActive = !isActive
		await update({ id }, { isActive })
	}
	const verify = async (id: number) => {
		await update({ id }, { isVerified: true })
	}
	return { verified, unverified, reduced, fetch, update, toggle, verify }
})

export default useUsers