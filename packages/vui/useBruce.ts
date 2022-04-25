import { get, MaybeRef, useFetch, UseFetchOptions, whenever } from "@vueuse/core"
import { delay } from "fn"
import { find } from "ramda"
import { ref, computed } from "vue"
import sha256 from "crypto-js/sha256"

const bruce = useFetch('https://bruce.one/banners.json').get().json()
const api   = 'https://api.fitravel.info'

type D = Record<string, any>

export function useBruce () {
	const getSource = (slug: string) => find((i: any) => i?.slug === slug)(bruce.data.value) ?? null
	const fetchStats = (query: MaybeRef<D[]|D>, options?: UseFetchOptions) => {
		const config  = { refetch: false, immediate: false, ...options }
		const token   = ref('')
		const body    = computed(() => ({ token: token.value, query: get(query) }))
		const init    = useFetch(`${api}/init-stats-background`, config).post(body).text()
		const results = useFetch(computed(() => `${api}/fetch-stats?token=${token.value}`), config).get().json()
		const isReady = computed(() => results.data.value?.isReady ?? false)
		const stats   = computed(() => results.data.value?.results ?? [])

		async function check () {
			results.execute()
			await delay(3000)
			if (!isReady.value) check()
		}
		whenever(init.isFinished, check)

		const execute = () => {
			token.value = sha256(JSON.stringify(get(query)) + (new Date().toString())).toString()
			init.execute()
		}

		return { ...results, stats, execute, isReady }
	}

	return { ...bruce, getSource, fetchStats, isReady: bruce.isFinished }
}