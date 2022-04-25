import { type BannerSource, fetchBannerSources } from "gygax"
import createBranch from "./createBranch"
import renderSource from "./renderSource"
import config from "./banners.config"

export const renderRoot = createBranch<{}, BannerSource>({
	path: config.BASE,
	children: await fetchBannerSources(),
	child: renderSource,
	index: () => ''
})

export default renderRoot