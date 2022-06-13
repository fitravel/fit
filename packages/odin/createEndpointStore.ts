import { defineStore } from "pinia"
import { type R, find, includes, map, prop, join, compose, length, update, any, isNil, pick, 
	values, sort, toPairs, forEach, unrefProps, o, reject, findIndex } from "geri"
import { ref, computed, type UnwrapRef, Ref } from "vue"
import { asyncComputed, isFunction, whenever } from "@vueuse/core"
import { fetchEndpoint } from "./fetchEndpoint"
import { useOwners } from "gygax"

interface StoreItem <T = R>{ 
	hash: string; 
	data: T; 
	isFetching: boolean;
}

export function createHash (query: R) {
	const fn = compose(
		join('+'), 
		map(join(':')), 
		sort((a, b) => a[0].localeCompare(b[0])), 
		toPairs
	)
	return fn(query)
}

export function createEndpointStore <T = R>({
	query: queryFn = (i: R) => i,
	url,
	model = (i: any) => i as T[]|T,
	prereq = [],
	fallback = null
}: {
	query?: (i: R) => R;
	url?: (i: R, guid?: string) => string;
	model?: (i: any) => T|T[];
	prereq?: string[];
	fallback?: any;
}) {
	const storeId     = join('-')([ 'odin', ...queryFn({}).actions ])
	const checkPrereq = prereq.length < 1 ? compose<any, R, any[], boolean>(any(isNil), values, pick(prereq)) : () => true
	const dummy       = isFunction(fallback) ? fallback() : fallback

	return defineStore(storeId, () => {
		const hashedItems = ref<StoreItem<T>[]>([])
		const inQueue     = ref<[R, boolean][]>([])
		const hashes      = computed(() => map(prop('hash'))(hashedItems.value))
		const items       = computed(() => map(prop('data'))(hashedItems.value))
		const isFetching  = computed(() => !!o<StoreItem<T>[], StoreItem<T>[], number>(length, reject((i: StoreItem<T>) => i.isFetching))(hashedItems.value as StoreItem<T>[]))
		const isReady     = computed(() => !isFetching.value)
		
		async function query (i: R, force = false) {
			const query = o(queryFn, unrefProps)(i)
			const hash  = createHash(query)
			
			if (!useOwners().isReady) {
				console.log('trallala')
				inQueue.value.push([ i, force ])
				return dummy
			}
			// if (!checkPrereq(query)) return dummy
			if (force || !includes(hash)(hashes.value)) {
				hashedItems.value.push({ hash, data: null, isFetching: true })
				
				const load = await fetchEndpoint(url, () => query)

				hashedItems.value = update(
					findIndex((i: StoreItem<T>) => i.hash === hash)(hashedItems.value as StoreItem<T>[]), 
					{ hash, data: model(load) as UnwrapRef<T>, isFetching: false },
					hashedItems.value
				)
			}
			return (find((i: StoreItem) => i.hash === hash)(hashedItems.value)?.data ?? dummy) as T|null
		}
		const queried = (i: () => R, flag?: Ref<boolean>) => {
			const fn = async () => (flag?.value ?? true) ? await query(i()) : dummy
			return asyncComputed(fn, dummy)
		}
		const dump = () => {
			const dumped = hashedItems.value
			hashedItems.value = []
			return dumped
		}

		whenever(
			() => (useOwners?.()?.isReady ?? false) && inQueue.value.length, 
			() => forEach(([ q, f ]) => query(q, f))(inQueue.value)
		)
		return { query, queried, items, isFetching, isReady, hashes, hashedItems, dump }
	}, 
	{
		persist: {
			storage: window.sessionStorage
		}
	})
}

export default createEndpointStore