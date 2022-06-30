import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { byId, filter, find, key, reject, type R } from "geri"
import fetchEndpoint from "./fetchEndpoint"
import useAuth from "./useAuth"


export const useUsers = defineStore('heimdall-users', () => {
	const _users = ref([] as R[])
	const _user  = ref({} as R)

	const reduced    = (fn: any, args = () => [ key('isVerified') ] as any[]) => computed(() => fn(...args())(_users.value))
	const verified   = reduced(filter)
	const unverified = reduced(reject)
	const user       = computed(() => _user.value)

	const _fetch = async (query: R = {}) => {
		const auth = useAuth()
		return await fetchEndpoint('GET', query, {}, auth.token).catch(error => {
			console.log(error)
			return []
		})
	}
	const fetchAll = async () => {
		_users.value = await _fetch()
	}
	const fetch = async (id: number) => {
		_user.value = await _fetch({ id })
	}
	const _refresh = (list: boolean) => {
		return list ? fetchAll() : fetch(user.value.id)
	}
	const _update = async (query: R, data: R) => {
		const auth = useAuth()
		return fetchEndpoint('PATCH', query, data, auth.token)
	}
	const update = async (query: R, data: R, list = false) => {
		await _update(query, data)
		return _refresh(list)
	}
	const toggle = async (id: number, list = false) => {
		let { isActive = false } = find<R>(byId(id))(verified.value) ?? {}
		isActive = !isActive
		await _update({ id }, { isActive })
		return _refresh(list)
	}
	const verify = async (id: number, list = false) => {
		await _update({ id }, { isVerified: true })
		return _refresh(list)
	}
	return { verified, unverified, user, reduced, fetch, fetchAll, update, toggle, verify }
})

export default useUsers