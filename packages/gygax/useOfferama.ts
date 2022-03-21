import { isNil, map, split, compose, flatten, filter, o } from "fn"
import { parse } from 'qs'
import { initState } from './initState'
import { isAfter } from "date-fns"

export interface Offer {
	isActive: boolean;
	owner: number;
	url: string;
	spotlight: boolean;
	comment: string;
	class: string;
	query: AvailabilityQuery;
}
export interface Offerama {
	id: number;
	slug: string;
	title: string;
	offers: Offer[];
}
export interface AvailabilityQuery {
	oid: number;
	from: string|Date;
	to?: string|Date;
	destination: number;
	currency?: number;
	outbound?: number;
	inbound?: number;
	adults?: number;
	children?: number;
	infants?: number;
	origin?: number;
	hotel?: number;
	room?: number;
	mealplan?: number;
	flightOnly?: boolean;
}

function parseOffer (i: Record<string, any>) {
	const o = parse(split('?')(i.url)[1])
	const query: AvailabilityQuery = {
		oid: i.owner,
		from: new Date(o.from as string|Date),
		to: isNil(o?.to) ? undefined : new Date(o.to as string|Date),
		outbound: isNil(o?.out) ? undefined : +o.out,
		inbound: isNil(o?.in) ? undefined : +o.in,
		adults: +(o?.adults ?? o?.adt ?? 1),
		children: +(o?.children ?? o?.chd ?? 0),
		infants: +(o?.infants ?? o?.inf ?? 0),
		destination: +(o?.destination ?? o?.dest ?? 0),
		origin: isNil(o?.departing ?? o?.dep) ? undefined : +(o?.departing ?? o?.dep ?? 0),
		hotel: +(o?.hotel ?? o?.hid ?? o?.id ?? 0),
		room: +(o?.room ?? o?.rid ?? 0),
		mealplan: +(o?.mealplan ?? o?.mid ?? o?.mp ?? 0)
	}
	return { ...i, query } as unknown as Offer
}
function model (i: Record<string, any>) {
	const { id, slug, acf } = i

	const title  = i?.title?.rendered ?? ''
	const purge  = filter((i: Offer) => (i?.isActive ?? false) && isAfter(new Date(i.query.from), new Date()))
	const offers = o(purge, map(parseOffer))(acf?.offers ?? [])

	return { id, slug, title, offers }
}
export const useOfferama = initState<Offerama>('offeramas', model, { sites: 244 }, {
	getters: {
		offers: (state: any) => (compose(flatten, map((i: Offerama) => i.offers)) as (i: Offerama[]) => Offer[])(state.items)
	}
})

export default useOfferama