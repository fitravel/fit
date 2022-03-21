import { FlightResult } from "./useFlightAvailability"
import { sum } from "ramda"

export function flightPrice (flight: FlightResult, { isBase = true, isTax = true, isFlightOnly = false, isOneWay = false } = {}) {
	const price = (key: string, flag = true) => (
		flag ? +(flight.prices?.[key] ?? 0) : 0
	)
	return sum([
		price('base', isBase),
		price('oneWay', isOneWay),
		price('flightOnly', isFlightOnly),
		price('tax', isTax)
	])
}

export default flightPrice