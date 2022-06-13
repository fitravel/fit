import { type R, map, filter, o, dashDate } from "geri"
import { isValid } from "date-fns"
import { Airport, Pricing } from "./useFlightAvailability"
import createEndpointStore from "./createEndpointStore";


interface FlightClass {
	id: number;
	name: string;
	prices: {
		adult: Pricing;
		adultTax: Pricing;
		child: Pricing;
		childTax: Pricing;
		infant: Pricing;
		infantTax: Pricing;
	}
	isAvailable: boolean;
	comments: {
		class: string;
		baggage: string;
	}
}
interface FlightScheduleItem {
	id: number;
	code: string;
	origin: Airport;
	destination: Airport;
	classes: FlightClass[];
	departure: Date|string;
	arrival: Date|string;
}

const query = ({ oid, getPrices = true, currency = 1, from: fromDate, to: toDate }: R) => {
	const actions = [ 'flights', 'is-IS', 'schedule' ]
	const from    = isValid(new Date(fromDate)) ? dashDate(fromDate) : undefined
	const to      = isValid(new Date(toDate)) ? dashDate(toDate) : undefined
	return { oid, actions, getPrices, currency, from, to }
}
const model = (a: R[]) => {
	const flightClass = ({ 
		id, name, isAvailable, comment, baggageIncluded,
		adultPrice, adultTax, childPrice, childTax, infantPrice, infantTax 
	}: R): FlightClass => ({
		id, name, isAvailable,
		prices: {
			adult: adultPrice, adultTax, 
			child: childPrice, childTax, 
			infant: infantPrice, infantTax
		},
		comments: {
			class: comment,
			baggage: baggageIncluded
		}
	})
	const flightScheduleItem = ({ 
		id, code, 
		classes: distribution,
		departureAirport: origin, 
		arrivalAirport: destination,
		departureDate: departure,
		arrivalDate: arrival
	}: R): FlightScheduleItem => {
		const classes   = o<R[], R[], FlightClass[]>(map(flightClass), filter((i: R) => i.isAvailable))(distribution)
		return { id, code, origin, departure, destination, arrival, classes }
	}
	return map(flightScheduleItem)(a)
}
const fallback = []

export const useFlightSchedules = createEndpointStore<FlightScheduleItem>({ query, model, fallback })

export default useFlightSchedules