import { fetchBanners, type BannerSource } from "gygax"
import { createBranch } from "./createBranch"
import { renderSource}  from "./renderSource"

export const renderRoot = async () => {
	const path     = ''
	const children = await fetchBanners()
	const child    = renderSource
	
	return createBranch<{}, BannerSource>({ path, children, child })()
}