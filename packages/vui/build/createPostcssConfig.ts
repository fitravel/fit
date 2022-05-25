import renderFile from "./renderFile"

export const createPostcssConfig = renderFile('./postcss.config.js', async (_config) => `
	module.exports = {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	}
`)

export default createPostcssConfig