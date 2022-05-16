import { parse } from "qs"
import { difdef, nifdef, split } from "geri"

export interface AvailabilityQuery {
	oid?: number;
	from?: string|Date|null;
	to?: string|Date|null;
	destination?: number;
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
	isValid?: boolean;
}

export function parseAvailabilityQuery (url: string, overrides: AvailabilityQuery = {}): AvailabilityQuery {
	const { oid, owner, from, to, out, outbound, outId, in: inn, inbound, inId,
		adt, adults, chd, children, inf, infants, destination, dest, departing, dep, origin,
	 	hotel, hid, id, room, rid, mealplan, mid, mp } = parse(split('?')(url)[1])

	const query = {
		oid: nifdef(oid ?? owner, 0),
		from: difdef(from) ?? null,
		to: difdef(to) ?? null,
		outbound: nifdef(out ?? outbound ?? outId, 0),
		inbound: nifdef(inn ?? inbound ?? inId, 0),
		adults: nifdef(adults ?? adt, 1),
		children: nifdef(children ?? chd, 0),
		infants: nifdef(infants ?? inf, 0),
		destination: nifdef(destination ?? dest, 0),
		origin: nifdef(origin ?? departing ?? dep, 0),
		hotel: nifdef(hotel ?? hid ?? id, 0),
		room: nifdef(room ?? rid, 0),
		mealplan: nifdef(mealplan ?? mid ?? mp, 0),
		...overrides
	}
	return { 
		...query, 
		isValid: !!(query.oid && query.from && query.adults && query.destination) 
	}
}