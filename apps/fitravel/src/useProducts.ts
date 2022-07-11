import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { type R } from "geri"
import { createAuthFetch } from "heimdall"

export const useProducts = defineStore('products', () => {
	const endpoint = 'products'
	const _items   = ref([] as R[])
	const items    = computed(() => _items.value)

	const fetch = createAuthFetch({ method: 'GET', endpoint, ref: _items, fallback: [] })

	return { items, fetch }
})

export default useProducts