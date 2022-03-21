import { useAsyncState, whenever } from '@vueuse/core'
import { computed } from 'vue'
import { stringify } from 'qs'
import { find, head, sum, o } from 'ramda'
import { isk, vanityPrice, propEq, byId } from "fn"
import { AvailabilityQuery, useOwners } from 'gygax'
import { useHotelAvailability, useFlightOffer } from '.'
import { curry } from "ramda"
import { differenceInCalendarDays } from "date-fns"

export function useHotelOffer (query: AvailabilityQuery) {
	const owners  = useOwners()
	const store   = useHotelAvailability()
	const flights = useFlightOffer(query)

	const { state, isReady, execute } = useAsyncState(() => store.check(query), { destination: { id: 0, name: '' }, hotels: [] }, { immediate: false })
	const destination = computed(() => state.value.destination)
	const stay = computed(() => {
		const days = differenceInCalendarDays(query.to, query.from)
		return `${days} ${days > 1 ? 'dagar' : 'dagur'}`
	})
	const hotel = computed(() => find(byId(+query.hotel ?? 0))(state.value?.hotels ?? []) ?? null)
	const rooms = computed(() => hotel.value?.rooms ?? [])
	const room = computed(() => {
		const byRoomId = i => i.id === +query.room
		const byMealplanId = i => i.mealplan.id === +(query?.mealplan ?? 0)
		return find(i => byRoomId(i) && byMealplanId(i))(rooms.value) ?? head(rooms.value) ?? null
	})
	if (owners.isReady) execute(); else whenever(() => owners.isReady, () => execute())
	const isError = computed(() => isReady.value)
	const pricePerPax = computed(() => (room.value?.price.perPax ?? 0) + flights.pricePerPax.value)
	const totalPrice  = computed(() => (room.value?.price.total.price ?? 0) + flights.totalPrice.value)

	const url = computed(() => {
		const params = {
			dep: query?.origin ?? 1,
			dest: query?.destination ?? 1,
			from: query.from,
			to: query.to,
			out: flights.outbound.value?.id ?? 0,
			in: flights.inbound.value?.id ?? 0,
			adt: query?.adults ?? 1,
			chd: query?.children ?? 0,
			inf: query?.infants ?? 0,
		}
		return `https://plusferdir.is/boka/velja-hotel/?${stringify(params)}`
	})

	return { destination, stay, url, hotel, room,  pricePerPax, totalPrice, isReady, isError }
}