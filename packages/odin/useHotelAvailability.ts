import { pick, map, join, sort, compose, toPairs, includes, take, propEq, find, dashDate, isNil } from 'fn'
import { defineStore } from 'pinia'
import type { AvailabilityQuery } from 'gygax'
import { fetchEndpoint } from './fetchEndpoint'

export interface Pricing {
	price: number;
	encrypted: string;
}
export interface RoomResult {
	id: number;
	name: string;
	isAvailable: boolean;
	mealplan: {
		id: number;
		name: string;
		code: string;
		pricing: Pricing;
	},
	price: {
		total: Pricing;
		room: Pricing;
		mealplan: Pricing;
		perPax: number;
	}
}
export interface HotelResult {
	id: number;
	externalId: number;
	name: string;
	shortName: string;
	destination: string;
	place: string;
	rooms: RoomResult[];
	price: {
		perPax: number;
		total: number;
	};
	images: {
		id: number;
		name: string;
		isMaster: boolean;
		url: string;
		thumb: string;
	}[];
	coordinates: {
		lat: number;
		lng: number;
	};
	inventoryType: string;
	roomCount: number;
	url: string;
	telephone: string;
	address: string;
	properties: Record<string, any>[];
}
export interface HotelResults {
	destination: {
		id: number;
		name: string;
	};
	hotels: HotelResult[];
}
export interface HotelAvailability {
	hash: string;
	data: HotelResults;
}

export const roomModel = (i: Record<string, any>) => {
	const { id, name, isAvailable, mealPlan: mealplan } = i

	const price = {
		total: i.totalPrice,
		room: i.roomPrice,
		mealplan: i.mealPlanPrice,
		perPax: i.pricePerPerson
	}

	return { id, name, isAvailable, mealplan, price }
}

export const model = (i: Record<string, any>) => {
	const { id, externalID: externalId, name, shortName, stars, coordinates, inventoryType, roomCount, telephone, url, address } = i

	const rooms  = map(roomModel)(i.rooms)
	const hero   = find(i => i.isMaster)(i.files)?.url ?? ''
	const images = map(i => i.url)(i.files)
	const place  = i.place
	const destination = i.destination

	const copy = {
		short: i.shortDescription,
		long: i.description
	} 
	const price = {
		perPax: i.pricePerPersonFrom,
		total: i.totalPriceFrom
	}

	return { 
		id, externalId, stars, copy, images, rooms, price, coordinates, inventoryType,
		roomCount, telephone, url, address, place, destination, hero, name, shortName
	}
}
export const useHotelAvailability = defineStore('odin-hotel-availability', {
	state: () => ({
		items: [] as HotelAvailability[]
  }),

	getters: {
		hashes: (state) => map(i => i.hash)(state.items)
	},
	
  actions: {
		createHash (query: AvailabilityQuery) {
			const props = [ 'destination', 'origin', 'from', 'to', 'adults', 'children', 'infants', 'hotel', 'mealplan', 'room' ]
			return compose(join('+'), map(join(':')), sort((a, b) => a[0].localeCompare(b[0])), toPairs)(pick(props)(query) as Record<string, any>)
		},
    async check (query: AvailabilityQuery) {
			const hash = this.createHash(query)
			if (!includes(hash)(this.hashes)) await this.fetch(query, hash)
			return find<HotelAvailability>((i) => i.hash === hash)(this.items)?.data ?? null
    },
		async fetch (query: AvailabilityQuery, _hash?: string) {
			const hash = _hash ?? this.createHash(query)
			this.hashes.push(hash)

			const { oid, currency = 1, destination: destinations, hotel: hotelId, adults = 1, children = 0, infants = 0, from, to, transformation = 38 } = query
			const load = await fetchEndpoint(oid, 'hotels', 'search', { 
				oid, currency, hotelId, transformation, destinations, 
				from: dashDate(from), to: isNil(to) ? undefined : dashDate(to),
				adults, children, infants
			})
			const data = {
				destination: {
					id: load[0].id,
					name: load[0].name
				},
				hotels: map(model)(load[0].hotels)
			}
			this.items.push({ hash, data })
		}
  }
})

export default useHotelAvailability