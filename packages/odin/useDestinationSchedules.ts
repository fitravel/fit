import createEndpointStore from "./createEndpointStore"
import { type R, map } from "geri"
import { Airport } from "./useFlightAvailability";

interface DestinationScheduleItem {
	id: number;
	code: string;
	available: number;
	hotelCheckInDate?: string;
	hotelCheckOutDate?: string;
	origin: Airport;
	departure: string;
	destination: Airport;
	arrival: string;
	returnLimit: number[];
}
interface DestinationSchedule {
	outbound: DestinationScheduleItem[];
	inbound: DestinationScheduleItem[];
}

const query = ({ oid, origin, destination, ways = 'both' }: R) => ({ 
	oid, actions: [ 'flights', 'is-IS', 'schedule', 'destinations' ],
	ways, departingDestination: origin, arrivingDestination: destination 
})
const model = ({ outbound, inbound }: R): DestinationSchedule => {
	const flight = ({ 
		id, code, available, returnLimit,
		hotelCheckInDate, hotelCheckOutDate, 
		departingAirport: origin, arrivingAirport: destination,
		departureDate: departure, arrivalDate: arrival
	}: R): DestinationScheduleItem => ({
		id, code, available, returnLimit,
		hotelCheckInDate, hotelCheckOutDate,
		origin, departure, destination, arrival
	})
	return {
		outbound: map(flight)(outbound),
		inbound: map(flight)(inbound)
	}
}
const fallback = { outbound: [], inbound: [] } 

export const useDestinationSchedules = createEndpointStore<any>({ query, model, fallback })

export default useDestinationSchedules