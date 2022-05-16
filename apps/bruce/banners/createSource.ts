import { type BannerSource, type BannerSlot } from "gygax"
import { createBranch } from "./createBranch"
import { createSlot } from "./createSlot"

export const createSource = createBranch<BannerSource, BannerSlot>({
	path: i => i.path,
	children: i => i.slots,
	child: createSlot,
	index: ({ hero }) => `
		<style>
			body {
				background-image: url('${hero}');
				background-size: cover;
			}
		</style>
	`
})

export default createSource