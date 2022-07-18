import { defineStore } from "pinia"
import { computed, ref, type Ref } from "vue"
import { byId, filter, find, isEmpty, key, reject, type R, prop } from "geri"
import fetchEndpoint from "./fetchEndpoint"
import useAuth from "./useAuth"
import { createItemStore, createListStore, type ItemStoreContext, type ListStoreContext } from "mimir"
import { createSecureFetchAPI } from "./createSecureFetchAPI"

export interface User {
	id: number
	name: string
	registry: string
	licence: string
	contact: string
	email: string
	phone: string
	role: 'admin'|'reseller'
	isActive: boolean
	isTerms: boolean 
	isVerified: boolean 
	token: string 
	created: string|Date 
}
interface UserListStoreContext extends ListStoreContext<User> {
	verified: Ref<User[]>
	unverified: Ref<User[]>
}
interface UserItemStoreContext extends ItemStoreContext<User> {
	verify: (id: number) => Promise<{ message: string }>
	toggle: (id: number) => Promise<{ message: string }>
}

export const useUsers = createListStore<User, UserListStoreContext>(
	{
		endpoint: 'users',
		apiFactory: createSecureFetchAPI<User>
	},
	context => {
		const verified   = computed(() => context.filter(i => i.isVerified))
		const unverified = computed(() => context.reject(i => i.isVerified))

		return { ...context, verified, unverified }
	}
)

export const useUser = createItemStore<User, UserItemStoreContext>(
	{
		endpoint: 'users',
		apiFactory: createSecureFetchAPI<User>
	},
	context => {
		const verify = (id: number = context.data.value.id) => context.patch({ id }, { isVerified: true }) 
		const toggle = (id: number = context.data.value.id) => context.patch({ id }, { isActive: !(useUsers().find(byId(id))?.isActive ?? true) })

		return { ...context, verify, toggle }
	}
)

// export const useUserss = defineStore('heimdall-users', () => {
// 	const _users = ref([] as User[])
// 	const _user  = ref(null as User|null)
	
// 	const _fetch = async (query: R = {}) => {
// 		const auth = useAuth()
// 		return await fetchEndpoint('GET', query, {}, auth.token).catch(error => {
// 			console.log(error)
// 			return []
// 		})
// 	}
// 	const _refresh = (list: boolean) => {
// 		return list ? fetchAll() : fetch(user.value?.id ?? 0)
// 	}
// 	const _update = async (query: R, data: R) => {
// 		const auth = useAuth()
// 		return fetchEndpoint('PATCH', query, data, auth.token)
// 	}

// 	//

// 	const reduced    = (fn: any, args = () => [ key('isVerified') ] as any[]) => computed(() => fn(...args())(_users.value))
// 	const verified   = reduced(filter)
// 	const unverified = reduced(reject)
// 	const user       = computed(() => ({ ...(_user.value ?? {}), isReady: !!_user.value }))
// 	const isReady    = computed(() => !isEmpty(_users.value))

// 	// 

// 	const fetchAll = async () => {
// 		_users.value = await _fetch()
// 	}
// 	const fetch = async (id: number) => {
// 		_user.value = await _fetch({ id })
// 	}
// 	const update = async (query: R, data: R, list = false) => {
// 		await _update(query, data)
// 		return _refresh(list)
// 	}
// 	const create = async (data: R) => {
// 		return fetchEndpoint('PUT', {}, data)
// 	} 
// 	const toggle = async (id: number, list = false) => {
// 		let { isActive = false } = find<R>(byId(id))(verified.value) ?? {}
// 		isActive = !isActive
// 		await _update({ id }, { isActive })
// 		return _refresh(list)
// 	}
// 	const verify = async (id: number, list = false) => {
// 		await _update({ id }, { isVerified: true })
// 		return _refresh(list)
// 	}
// 	return { verified, unverified, user, reduced, create, fetch, fetchAll, update, toggle, verify, isReady }
// })

export default useUsers