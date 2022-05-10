import { getExt, includes, isNil, last, map, o, sluggify, split, without } from "fn"
import { subYears, addYears } from "date-fns"
import { initState } from "./initState"
import { getHero } from "./getHero"
import { type GygaxData } from "."
import { createEndpoint } from "./createEndpoint"
import { inspect } from "util"

export interface Banner {
	id: number;
	source: string;
	slot: string;
	brand: string;
	campaign: string;
	content: string;
	url: string;
	file: string;
	ext: string;
	startDate: Date;
	endDate: Date;
	path: string;
}
export interface BannerSlot {
	source: string;
	slug: string;
	width: number;
	height: number;
	banners: Banner[];
	fallback: Banner;
	path: string;
}
export interface BannerSource {
	id: number;
	slug: string;
	title: string;
	modified: Date;
	slots: BannerSlot[];
	hero: string;
	url: string;
	path: string;
}

export function bannerModel (source: string, slot: string, basePath: string, fallback = false): (i: GygaxData) => Banner {
	return (i: GygaxData) => {
		const brand    = (i?.brand?.slug ?? 'uu') as 'uu'|'pf'|'sf'
		const campaign = i?.campaign?.slug ?? brand ?? null
		const content  = i?.link?.post_name ?? 'uu-forsida'

		const id   = fallback ? 'fallback' : i?.file?.id ?? 0
		const base = i?.link?.acf?.url ?? `https://${{ uu: 'uu', pf: 'plusferdir', sf: 'sumarferdir' }[brand]}.is/`
		const utm  = `utm_source=${source}&utm_medium=banner&utm_campaign=${campaign}&utm_content=${content}`
		const url  = `${base}${includes('?')(base) ? '&' : '?'}${utm}`
		const xoo  = last(split('/')(i?.file?.url ?? ''))
		const file = isNil(xoo) ? 'https://api.fitravel.info/banner.zip' : `https://res.cloudinary.com/fitravel/raw/upload/v1/gygax/${xoo}`
		const ext  = getExt(file)
		const path = `${basePath}/${id}`

		const startDate = new Date(i?.startDate || subYears(new Date(), 1))
		const endDate   = new Date(i?.endDate || addYears(new Date(), 1))

		return { id, source, slot, brand, campaign, content, url, file, ext, startDate, endDate, path }
	}
}
export function slotModel (source: string, basePath: string): (i: GygaxData) => BannerSlot {
	return (i: GygaxData) => {
		const { width = 0, height = 0 } = i?.size?.acf ?? {}

		const slug     = sluggify(`${width}x${height}${i.slug ? `-${i.slug}` : ''}`)
		const path     = `${basePath}/${slug}`
		const banners  = map(bannerModel(source, slug, path))(i?.banners || [])
		const fallback = bannerModel(source, slug, path, true)(i?.fallback ?? {})

		return { source, slug, width, height, banners, fallback, path }
	}
}
export function sourceModel (i: GygaxData): BannerSource {
	const { id = 0, slug = '', acf } = i

	const title    = i?.title?.rendered ?? ''
	const modified = new Date(i?.modified ?? new Date())
	const path     = `/${slug}`
	const slots    = map(slotModel(slug, path))(acf?.slots ?? [])
	const hero     = getHero(i)
	const url      = acf?.sourceURL ?? '#'

	return { id, slug, title, modified, slots, hero, url, path }
}

export const fetchBanners = createEndpoint<BannerSource>('banneramas', sourceModel)
export const useBanners   = initState<BannerSource>('banneramas', sourceModel)