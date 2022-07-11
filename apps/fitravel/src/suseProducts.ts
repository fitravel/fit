import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { useAuth } from "heimdall"
import { byId, filter, find, isEmpty, unrefProps, type R } from "geri"
import { stringify } from "qs"

//@ts-ignore
const api = import.meta.env.DEV ? 'http://localhost:9999/.netlify/functions/products' : 'https://fitravel.is/api/products'

export async function fetchEndpoint (method: string, query: R, payload: any, token = '') {
	const search  = stringify(unrefProps(query))
	const options = { method, headers: new Headers() } as R

	if (token) options.headers.append('Authorization', `Bearer ${token}`)
	if (method !== 'GET') options.body = JSON.stringify(unrefProps(payload))

	return fetch(`${api}?${search}`, options).then(async response => {
		const body = await response.json()
		if (response.status !== 200) throw body?.error ?? 'Það kom upp villa'
		return body
	})
}

export const useProducts = defineStore('fitravel-products', () => {
	const _products = ref([] as R[])
	const _product  = ref<R|null>(null)

	const initAuth = () => {
		useAuth()
	}

	const _fetch = async (query: R = {}) => {
		const auth = useAuth()
		return await fetchEndpoint('GET', query, {}, auth.token).catch(error => {
			console.log(error)
			return []
		})
	}
	const _refresh = (list: boolean) => {
		return list ? fetchAll() : fetch(product.value?.id ?? 0)
	}
	const _update = async (query: R, data: R) => {
		const auth = useAuth()
		return fetchEndpoint('PATCH', query, data, auth.token)
	}	
	
	//

	const products = computed(() => _products.value)
	const product  = computed<R>(() => ({ ...(_product.value ?? {}), isReady: !!_product.value }))
	const isReady  = computed(() => isEmpty(_product.value))

	//

	const fetchAll = async () => {
		_products.value = await _fetch()
	}
	const fetch = async (id: number) => {
		_product.value = await _fetch({ id })
	}
	const update = async (query: R, data: R, list = false) => {
		await _update(query, data)
		return _refresh(list)
	}
	const create = async (data: R) => {
		const auth = useAuth()
		return fetchEndpoint('PUT', {}, data, auth.token)
	} 
	const toggle = async (id: number, list = false) => {
		let { isActive = false } = find<R>(byId(id))(products.value) ?? {}
		isActive = !isActive
		await _update({ id }, { isActive })
		return _refresh(list)
	}

	initAuth()

	return { products, product, create, fetch, fetchAll, update, toggle, isReady }
})

export default useProducts