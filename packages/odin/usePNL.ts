import createEndpointStore from "./createEndpointStore"
import { type R } from "geri"


const query = ({ flight: flightID, rowsCount }: R) => ({ flightID, rowsCount })
const url = () => 'secure/flights/pnl'
const model = (i: R): R => {
	return i
}
const fallback = { outbound: [], inbound: [] } 

export const usePNL = createEndpointStore<R>({ query, url, model, fallback })

export default usePNL