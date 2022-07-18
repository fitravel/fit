import { createSecureFetchAPI } from "heimdall"
import { createListStore } from "mimir"

export const useProducts = createListStore(
	{
		endpoint: 'products',
		apiFactory: createSecureFetchAPI
	},
	context => {

		return { ...context } 
	}
)

export default useProducts