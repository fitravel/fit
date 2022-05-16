import { o, trim, indent } from "geri"
import { createFile } from "freki"
import { SiteConfig } from "./defineSite"

export async function createTailwindConfig (config: SiteConfig) {
	const exts = '**/*.{vue,js,ts,jsx,tsx}'
	const content = `
		module.exports = {
			content: [
				'vui/${config.kit}/${exts}',
				'vui/base/${exts}',
				'./src/${exts}',
				'./index.html'
			]
		}
	`
	return createFile('./tailwind.config.js', o(trim, indent(0))(content))
}

export default createTailwindConfig