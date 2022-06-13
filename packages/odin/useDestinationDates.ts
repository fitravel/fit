import { createEndpointStore } from "./createEndpointStore"
import { type R } from "geri"

const query = ({ 
	oid, destination: id, 
	includePast = false, 
	includeServices = false,
	includeFlights = true
}: R) => ({
	actions: [ 'info', 'destinations', 'dates' ],
	oid, id, includePast, includeItems: (
		includeFlights && includeServices 
			? `flights,services` 
			: includeServices 
				? 'services'
				: includeFlights ? 'flights' : undefined
	)
})
const url = ({ id, actions }: R, guid) => `${actions[0]}/${guid}/${actions[1]}/${id}/${actions[2]}`
const model = (i) => {console.log(i); return i}
const fallback = {}

export const useDestinationDates = createEndpointStore<any>({ query, url, model, fallback })

export default useDestinationDates