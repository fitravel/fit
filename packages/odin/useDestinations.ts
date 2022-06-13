import { createEndpointStore } from "./createEndpointStore"
import { type R } from "geri"

const query = ({ 
	oid, onlyWithFlights = true
}: R) => ({
	actions: [ 'info', 'destinations' ],
	oid, onlyWithFlights
})
const model = (i) => {console.log('www', i); return i}
const fallback = []

export const useDestinations = createEndpointStore<any>({ query, model, fallback })

export default useDestinations