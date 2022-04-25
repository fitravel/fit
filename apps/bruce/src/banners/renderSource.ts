import { type BannerSource, type BannerSlot } from "gygax"
import createBranch from "./createBranch"
import renderSlot from "./renderSlot"

export const renderSource = createBranch<BannerSource, BannerSlot>({
	key: 'slots',
	fn: renderSlot,
	template: () => ''
})

export default renderSource