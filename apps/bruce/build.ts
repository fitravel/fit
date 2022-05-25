import { createDir, move } from "freki"
import { logHeading } from "freki"
import { createBanners } from "./banners"
import { buildSite } from "vui"
import config from "./site.config"

const smash = (i: string) => move(`./dist/${i}`, `./dist/smash/${i}`)

buildSite(config, {
	async afterInit () {
		logHeading('BUILD banners', 2)
		await createBanners()
	},
	async afterApp () {
		await createDir('./dist/smash')
		await Promise.all([
			smash('index.html'),
			smash('assets')
		])
	}
})