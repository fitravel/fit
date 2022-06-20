import { createEndpointStore } from "./createEndpointStore"
import { type R } from "geri"

export interface DestinationItem {
	id: number;
	name: string;
	shortName: string;
	code: string;
	isAvailable: boolean;
}

const query = ({ 
	oid, onlyWithFlights = true
}: R) => ({
	actions: [ 'info', 'destinations' ],
	oid, onlyWithFlights
})
const model = (a: R[]) => a as DestinationItem[]
const fallback = []

export const useDestinations = createEndpointStore<DestinationItem>({ query, model, fallback })

export default useDestinations