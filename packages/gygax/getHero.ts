import { type GygaxData } from "."

export const getHero = (i: GygaxData) => i?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null

export default getHero