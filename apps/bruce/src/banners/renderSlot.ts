import { type Banner, type BannerSlot } from "gygax"
import renderBanner from "./renderBanner"
import createBranch from "./createBranch"

export const renderSlot = createBranch<BannerSlot, Banner>({
	path: i => i.path,
	children: i => i.banners,
	child: renderBanner,
	index: () => ''
})

export default renderSlot