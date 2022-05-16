import { createFile } from "freki"
import { o, trim, indent } from "geri"

export async function createPostcssConfig () {
	const content = `
		module.exports = {
			plugins: {
				tailwindcss: {},
				autoprefixer: {},
			},
		}
	`
	return createFile('./postcss.config.js', o(trim, indent(0))(content))
}

export default createPostcssConfig