import { useAsyncState, whenever } from '@vueuse/core'
import { computed } from 'vue'
import { stringify } from 'qs'
import { find, head, sum, o } from 'ramda'
import { isk, vanityPrice, propEq } from "fn"
import { AvailabilityQuery, useOwners } from 'gygax'
import { useFlightAvailability } from '.'
import { FlightResult } from './useFlightAvailability'
import { curry } from "ramda"
import flightPrice from './flightPrice'

type RecordWithId = {
	id: number;
	[i: string]: any;
}

const findById = curry(function <T = RecordWithId>(id: number, fallback: (a: T[]) => T|undefined, supply: T[]) {
	return (find(propEq('id', id)) as unknown as (a: T[]) => T|undefined)(supply) ?? fallback(supply) ?? null
})

export function useFlightOffer (query: AvailabilityQuery) {
	const owners = useOwners()
	const store  = useFlightAvailability()

	const { state, isReady, execute, isError: isApiError } = useAsyncState(() => store.check(query), { outbound: [], inbound: [] }, { immediate: false })
	if (owners.isReady) execute(); else whenever(() => owners.isReady, () => execute())
	
	const outbound  = computed<FlightResult|null>(() => findById(query?.outbound ?? 0, head)(state.value?.outbound ?? []))
	const inbound   = computed<FlightResult|null>(() => findById(query?.inbound ?? 0, head)(state.value?.inbound ?? []))
	const isOneWay  = computed(() => !inbound.value)
	const isError   = computed(() => isReady.value && (isApiError.value || !outbound.value && (isOneWay.value ? !inbound.value : false)))

	const pricePerPax = computed(() => (outbound.value?.price.perPax ?? 0) + (inbound.value?.price.perPax ?? 0) + 900)
	const totalPrice  = computed(() => (outbound.value?.price.total ?? 0) + (inbound.value?.price.total ?? 0) + (900 * (+query.adults + +query.children)))

	const url = computed(() => {
		const params = {
			dep: query?.origin ?? 1,
			dest: query?.destination ?? 1,
			from: query.from,
			to: query.to,
			out: outbound.value?.id ?? 0,
			in: inbound.value?.id ?? 0,
			adt: query?.adults ?? 1,
			chd: query?.children ?? 0,
			inf: query?.infants ?? 0,
		}
		return `https://plusferdir.is/boka/flugsaeti/?${stringify(params)}`
	})

	return { outbound, inbound, isOneWay, url, pricePerPax, totalPrice, isReady }
}