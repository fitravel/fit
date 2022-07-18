import { createSecureFetchAPI } from "heimdall"
import { createItemStore, type ItemStoreContext } from "mimir"
import { type R } from "geri"

export interface Product {
	id: number
	title: string
	destination: string
	outbound: R[]
	inbound: R[]
	dateFrom: Date
	dateTo: Date
	available: number
	price: number
	comment: string
	published: Date
	created: Date
	createdBy: number
	modified: Date
	modifiedBy: number
}
export interface ProductItemStoreContext extends ItemStoreContext<Product> {
}

export const useProduct = createItemStore<Product, ProductItemStoreContext>(
	{ 
		endpoint: 'products', 
		apiFactory: createSecureFetchAPI
	},
	context => {
		return { ...context } as ProductItemStoreContext
	}
)

export default useProduct