import { fetchBanners, type BannerSource } from "gygax"
import { createBranch } from "./createBranch"
import { renderSource}  from "./renderSource"

export const renderRoot = async () => {
	const path     = ''
	const children = await fetchBanners()
	const child    = renderSource

	const index = () => `
		<style>
			body {
				background-image: url('/favicon.ico');
				background-size: contain;
			}
		</style>
	`
	return createBranch<{}, BannerSource>({ path, children, child, index })()
}