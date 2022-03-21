import { pick, map, join, sort, compose, toPairs, includes, take, propEq, find } from 'fn'
import { defineStore } from 'pinia'
import type { AvailabilityQuery } from 'gygax'
import { fetchEndpoint } from './fetchEndpoint'

export interface FlightAvailability {
	hash: string;
	data: FlightResults;
}

export interface Pricing {
	price: number;
	encrypted: string;
}

export interface Airport {
	name: string;
	code: string;
}
export interface AirplaneConfiguration {
	id: number;
	name: string;
	shortName: string;
	airline: string;
	aircraft: string;
	seatCount: number;
	rowCount: number;
}
export interface FlightResult {
	id: number;
	hasSeats: true;
	distribution: FlightDistribution[];
	code: string;
	comments: {
		flight: string;
		class: string;
		baggage: string;
	};
	available: number;
	hotelOffset: {
		checkIn: number;
		checkOut: number;
	}
	flightTime: number;
	departure: Date;
	arrival: Date;
	origin: Airport;
	destination: Airport;
	airplane: AirplaneConfiguration;
	price: {
		base: Pricing;
		tax: Pricing;
		oneWay: Pricing;
		flightOnly: Pricing;
		perPax: number;
		total: number;
	};
	returnLimit: number[];
}
export interface FlightResults {
	outbound: FlightResult[];
	inbound: FlightResult[];
}
export interface FlightDistribution {
	classID: number;
	name: string;
	code: string;
	baggageIncluded: string;
	comment: string;
	passengerIndex: number;
	type: 'Adult'|'Child'|'Infant';
	price: Pricing;
	tax: Pricing;
	flightOnlyCost: Pricing;
	oneWayCost: Pricing;
}
export const distributionModel = (i: Record<string, any>) => {
	const { name, code, comment, baggageIncluded, passengerIndex, type } = i

	const id = i.classID
	const prices = {
		base: i.price,
		tax: i.tax,
		flightOnly: i.flightOnlyCost,
		oneWay: i.oneWayCost
	}

	return { id, name, code, comment, baggageIncluded, passengerIndex, type, prices }
}
export const model = (i: Record<string, any>) => {
	const { id, hasSeats, code, available, flightTime, returnLimit } = i

	const distribution = map(distributionModel)(i.distribution)
	const departure    = new Date(i.departureDate)
	const arrival      = new Date(i.arrivalDate)
	const origin       = i.departureAirport
	const destination  = i.arrivalAirport

	const comments = {
		flight: i.comment,
		class: '',
		baggage: ''
	}
	const hotelOffset = {
		checkIn: i.hotelCheckinOffset,
		checkOut: i.hotelCheckoutOffset
	}
	const price = {
		base: i.price,
		tax: i.tax,
		oneWay: i.oneWayPrice,
		flightOnly: i.flightOnlyPrice,
		perPax: i.pricePerPerson,
		total: i.totalPrice
	}
	const airplane = {
		id: i.airplaneConfiguration.id,
		name: i.airplaneConfiguration.name,
		shortName: i.airplaneConfiguration.shortName,
		airline: i.airplaneConfiguration.aircraft,
		airlineCode: take(2)(i.airplaneConfiguration.aircraft),
		aircraft: i.airplaneConfiguration.airline,
		seatCount: i.airplaneConfiguration.seatCount,
		rowCount: i.airplaneConfiguration.rowCount	
	}

	return { 
		id, hasSeats, distribution, code, comments, available, hotelOffset, airplane,
		departure, arrival, flightTime, origin, destination, price, returnLimit
	}
}

export const useFlightAvailability = defineStore('odin-flight-availability', {
	state: () => ({
		items: [] as FlightAvailability[]
  }),

	getters: {
		hashes: (state) => map(i => i.hash)(state.items)
	},
	
  actions: {
		createHash (query: AvailabilityQuery) {
			const props = [ 'destination', 'origin', 'from', 'to', 'adults', 'children', 'infants', 'flightOnly' ]
			return compose(join('+'), map(join(':')), sort((a, b) => a[0].localeCompare(b[0])), toPairs)(pick(props)(query) as Record<string, any>)
		},
    async check (query: AvailabilityQuery) {
			const hash = this.createHash(query)
			if (!includes(hash)(this.hashes)) await this.fetch(query, hash)
			return find<FlightAvailability>((i) => i.hash === hash)(this.items)?.data ?? null
    },
		async fetch (query: AvailabilityQuery, _hash?: string) {
			const hash = _hash ?? this.createHash(query)
			this.hashes.push(hash)

			const { oid, currency = 1, destination, origin: departing = 1, adults = 1, children = 0, infants = 0, from, to, flightOnly = 1 } = query
			const { outbound = [], inbound = [] } = await fetchEndpoint(oid, 'flights', 'availability', { 
				oid, currency, flightOnly,
				destination, departing, from, to,
				adults, children, infants
			})
			const data = { outbound: map(model)(outbound), inbound: map(model)(inbound) }
			
			this.items.push({ hash, data })
		}
  }
})

export default useFlightAvailability