import { useFetch } from "@vueuse/core"
import { computed, ref, watch } from "vue"
import { delay } from "fn"

export function useRender ({ target, beforeRender = () => {}, afterRender = () => {} }: { 
	target: string;
	beforeRender?: () => any;
	afterRender?: () => any;
}) {
	const action      = ref('start')
	const url         = computed(() => `https://api.fitravel.info/render?${action.value}=${target}`)
	const options     = { immediate: false, refetch: false }
	const fetch       = useFetch(url, options).post().json()
	const isRendering = computed(() => fetch.data.value?.isRendering ?? false)
	const message     = computed(() => fetch.data.value?.message ?? '')

	const start = async () => {
		beforeRender()
		action.value = 'start'
		await fetch.execute()
	}
	const status = async () => {
		action.value = 'status'
		await fetch.execute()
	}
	const check = async (): Promise<any> => {
		if (isRendering.value) {
			await delay(2000)
			await status()
			return check()
		}
		return afterRender()
	}
	watch(isRendering, check)

	return { ...fetch, isRendering, message, start, status }
}