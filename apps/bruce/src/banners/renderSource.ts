import { type BannerSource, type BannerSlot } from "gygax"
import createBranch from "./createBranch"
import renderSlot from "./renderSlot"

export const renderSource = createBranch<BannerSource, BannerSlot>({
	path: i => i.path,
	children: i => i.slots,
	child: renderSlot,
	index: () => ''
})

export default renderSource