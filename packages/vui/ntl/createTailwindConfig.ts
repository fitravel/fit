import renderFile from "./renderFile"

export const createTailwindConfig = renderFile('./tailwind.config.js', async ({ kit }) => {
	const exts = '.{vue,js,ts,jsx,tsx}'
	return `
		module.exports = {
			content: [
				'../../packages/vui/@/${kit}/**/*${exts}',
				'../../packages/vui/@/*${exts}',
				'./src/**/*${exts}',
				'./index.html'
			]
		}
	`
})

export default createTailwindConfig