import { fetchBanners, type BannerSource } from "gygax"
import { createBranch } from "./createBranch"
import { createSource}  from "./createSource"
import { createFile } from "freki"

export const createBanners = async () => {
	const path     = ''
	const children = await fetchBanners()
	const child    = createSource

	await createFile(`./public/banners.json`, JSON.stringify(children))

	return createBranch<{}, BannerSource>({ path, children, child })()
}

export default createBanners