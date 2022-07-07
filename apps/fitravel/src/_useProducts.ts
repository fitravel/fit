import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { type R } from "geri"
import { fetchEndpoint } from "mimir"
import { useAuth } from "heimdall"
import { until } from "@vueuse/core"

export const useProducts = defineStore('products', () => {
	const _items = ref([] as R[])
	const items  = computed(() => _items.value)

	const fetch = async (query: R = {}) => {
		const auth = useAuth()
		await until(() => auth.isReady).toBe(true)
		const options = { method: 'GET', endpoint: 'products', token: auth.token, query }
		return fetchEndpoint(options).catch(error => {
			console.log(error)
			return []
		})
	}

	return { items, fetch }
})

export default useProducts