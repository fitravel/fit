import { createSecureFetchAPI } from "heimdall"
import { createItemStore, type StoreContext } from "mimir"
import { type R } from "geri"

interface ProductItemStoreContext extends Omit<StoreContext, 'get'> {
	get: (id: number) => Promise<R>
}

export const useProduct = createItemStore(
	{ 
		endpoint: 'products', 
		apiFactory: createSecureFetchAPI
	},
	context => {
		const get = (id: number): Promise<R> => context.get({ id }) as Promise<R>
		return { ...context, get } as ProductItemStoreContext
	}
)

export default useProduct