import { copyFile, access, readdir } from "fs/promises"
import { type BannerSource, fetchBannerSources } from "gygax"
import { resetDir } from "ntl"
import { createBranch, renderSource } from "./banners"
import { BASE_PATH } from "./banners"

async function init () {
	const root = createBranch<{}, BannerSource>({
		path: '',
		children: await fetchBannerSources(),
		child: renderSource,
		index: () => ''
	})
	await resetDir(BASE_PATH)
	console.log('Copying favicon.ico')
	await copyFile('./src/favicon.ico', `${BASE_PATH}/favicon.ico`)
	console.log('Copying robots.txt')
	await copyFile('./src/robots.txt', `${BASE_PATH}/robots.txt`)
	console.log('Rendering banner tree...')
	await root({})
}
init()