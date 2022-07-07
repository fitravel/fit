import renderFile from "./renderFile"

export const createPostcssConfig = renderFile('./postcss.config.js', async (_config) => `
	module.exports = {
		plugins: {
			'tailwindcss/nesting': {},
			tailwindcss: {},
			autoprefixer: {},
		},
	}
`)

export default createPostcssConfig