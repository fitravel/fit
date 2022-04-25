import { map, compose, flatten, filter, o, parseAvailabilityQuery, type AvailabilityQuery } from "fn"
import { initState } from './initState'
import { isAfter } from "date-fns"

export interface Offer {
	isActive: boolean;
	owner: number;
	url: string;
	isSpotlighted: boolean;
	comment: string;
	className: string;
	query: AvailabilityQuery;
}
export interface Offerama {
	id: number;
	slug: string;
	title: string;
	offers: Offer[];
}

function parseOffer (i: Record<string, any>) {
	const isActive      = i?.isActive ?? false
	const isSpotlighted = i?.spotlight ?? false 
	const owner         = i?.owner ?? 0
	const url           = i?.url ?? ''
	const comment       = i?.comment ?? ''
	const className     = i?.class ?? ''
	const query         = url ? parseAvailabilityQuery(url, { oid: owner }) : {}

	return { isActive, isSpotlighted, owner, url, comment, className, query } as Offer
}
function model (i: Record<string, any>) {
	const { id, slug, acf } = i

	const title  = i?.title?.rendered ?? ''
	const purge  = filter((i: Offer) => i.isActive && (i.query?.isValid ?? false) && isAfter(i.query.from as Date, new Date()))
	const offers = o(purge, map(parseOffer))(acf?.offers ?? [])

	return { id, slug, title, offers }
}

export const useOfferama = initState<Offerama>('offeramas', model, { sites: 244 }, {
	getters: {
		offers: (state: any) => (compose(flatten, map((i: Offerama) => i.offers)) as (i: Offerama[]) => Offer[])(state.items)
	}
})

export default useOfferama