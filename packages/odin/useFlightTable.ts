import { byId } from "geri"
import { type Owner, useOwners } from "gygax"
import { allPass, anyPass, compose, curry, filter, find, flatten, includes, map, o, prop, reject, reverse, sort, uniqBy } from "ramda"
import { computed, Ref, ref } from "vue"
import useDestinations, { DestinationItem } from "./useDestinations"
import useDestinationSchedules, { DestinationSchedule, DestinationScheduleItem } from "./useDestinationSchedules"
import useFlightSchedules, { FlightScheduleItem } from "./useFlightSchedules"
import { type SelectOption } from "vui"
import { asyncComputed } from "@vueuse/core"
import { addMonths, compareAsc } from "date-fns"

export type FlightTableItem = FlightScheduleItem & DestinationScheduleItem;

export function useFlightTable () {
	// OWNERS
	const ownerTypes: SelectOption[] = [
		{ text: 'Bara flug', value: 2 },
		{ text: 'Flug og gisting', value: 1 },
		{ text: 'Pakkar', value: 3 }
	]
	const ownerStore           = useOwners()
	const selectedOwnerType    = ref(1)
	const ownersOfSelectedType = computed(() => map((i: Owner) => ({ text: i.name, value: i.id }))(ownerStore.byType(selectedOwnerType.value)))
	const selectedOwner        = ref(2)

	// DESTINATIONS
	const destinationStore     = useDestinations()
	const allowedOrigins       = [ 1, 215 ]
	const queriedDestinations  = destinationStore.queried(() => ({ oid: selectedOwner }))
	const origins              = computed(() => filter((i: DestinationItem) => includes(i.id)(allowedOrigins))(queriedDestinations.value))
	const destinations         = computed(() => reject((i: DestinationItem) => includes(i.id)(allowedOrigins))(queriedDestinations.value))
	const selectedOrigins      = ref<number[]>([])
	const selectedDestinations = ref<number[]>([])
	const originIds            = computed<number[]>(() => selectedOrigins.value.length ? selectedOrigins.value : map(prop('id'))(origins.value))

	const directions = [
		{ text: 'Hvor sem er', value: 1 },
		{ text: 'Bara út', value: 2 },
		{ text: 'Bara heim', value: 3 }
	]
	const direction = ref(1)

	const filterByDirection = (i: FlightTableItem) => {
		const isValid = (i: string) => includes(findIdByCode(i, queriedDestinations))(originIds.value)
		switch (direction.value) {
			case 2: return isValid(i.origin.code)
			case 3: return isValid(i.destination.code)
			default: return true
		}
	}

	const findIdByCode = (code: string, ref: Ref<DestinationItem[]>) => find<DestinationItem>(i => i.code === code)(ref.value)?.id ?? 0
	const createDestinationFilter = (ref: Ref<DestinationItem[]>, selected: Ref<number[]>) => {
		return (i: FlightTableItem) => {
			if (!selected.value.length) return true
			const origin      = findIdByCode(i.origin.code, ref)
			const destination = findIdByCode(i.destination.code, ref)
			return includes(origin)(selected.value) || includes(destination)(selected.value)
		}
	}
	const filterByOrigin      = createDestinationFilter(origins, selectedOrigins)
	const filterByDestination = createDestinationFilter(destinations, selectedDestinations)

	// SCHEDULE
	const dateFrom                 = ref(new Date())
	const dateTo                   = ref(addMonths(dateFrom.value, 3))
	const flightScheduleStore      = useFlightSchedules()
	const destinationScheduleStore = useDestinationSchedules()
	const queriedMasterSchedule    = flightScheduleStore.queried(() => ({ oid: selectedOwner, from: dateFrom, to: dateTo }))
	const queriedExtendedSchedule  = asyncComputed<DestinationScheduleItem[]>(queryExtentedSchedule, [])
	const isDescending             = ref(false)

	async function queryExtentedSchedule () {
		const conjoin = compose<
			DestinationSchedule[][],
			DestinationScheduleItem[][],
			DestinationScheduleItem[],
			DestinationScheduleItem[]
		>(
			uniqBy(prop('id')), 
			flatten, 
			map((i: DestinationSchedule) => [ ...i.outbound, ...i.inbound ])
		)
		const toQueries = (i: DestinationItem) => {
			const query = (id: number) => destinationScheduleStore.query({ oid: selectedOwner, origin: id, destination: i.id })
			return map(query)(originIds.value)
		}
		const queryEach = o<DestinationItem[], Promise<any>[][], Promise<any>[]>(flatten, map(toQueries))
		const load = await Promise.all(queryEach(destinations.value)) as DestinationSchedule[]
		
		return conjoin(load)
	}
	const extendedSchedule = computed(() => {
		const extend = (i: FlightScheduleItem): FlightTableItem => {
			const item = (find(byId(i.id))(queriedExtendedSchedule.value) ?? {}) as DestinationScheduleItem
			const { 
				available = null, returnLimit = null, 
				hotelCheckInDate = item.departure, 
				hotelCheckOutDate = item.arrival 
			} = item

			return { ...i, ...item, available, returnLimit, hotelCheckInDate, hotelCheckOutDate }
		}
		return map(extend)(queriedMasterSchedule.value)
	})
	const schedule = computed(() => {
		const filterSchedule = filter(
			allPass([
				filterByOrigin,
				filterByDestination,
				filterByDirection
			])
		)
		const sortSchedule = (a: FlightTableItem[]) => {
			const b = sort<FlightTableItem>((x, y) => compareAsc(new Date(x.departure), new Date(y.departure)))(a)
			return isDescending.value ? reverse(b) : b
		}
		return compose(sortSchedule, filterSchedule)(extendedSchedule.value)
	})



	return {
		ownerTypes, selectedOwnerType, ownersOfSelectedType, selectedOwner,
		origins, destinations, selectedOrigins, selectedDestinations,
		directions, direction,
		dateFrom, dateTo, schedule
	}
}

export default useFlightTable