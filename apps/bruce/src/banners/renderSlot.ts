import { type Banner, type BannerSlot } from "gygax"
import renderBanner from "./renderBanner"
import createBranch from "./createBranch"

export const renderSlot = createBranch<BannerSlot, Banner>({
	key: 'banners',
	fn: renderBanner,
	template: () => ''
})

export default renderSlot