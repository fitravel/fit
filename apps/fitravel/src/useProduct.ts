import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { type R } from "geri"
import { createEndpoints } from "heimdall"
import useProducts from "./useProducts"

export const useProduct = defineStore('product', () => {
	const _item = ref({} as R)
	const item  = computed(() => _item.value)

	const { fetch, update, create } = createEndpoints('products', _item, {}, () => {
		const products = useProducts()
		return products.fetch()
	})
	return { item, fetch, update, create }
})