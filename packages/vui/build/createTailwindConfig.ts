import renderFile from "./renderFile"

export const createTailwindConfig = renderFile('./tailwind.config.js', async ({ kit }) => {
	const exts = '**/*.{vue,js,ts,jsx,tsx}'
	return `
		module.exports = {
			content: [
				'vui/${kit}/${exts}',
				'vui/base/${exts}',
				'./src/${exts}',
				'./index.html'
			]
		}
	`
})

export default createTailwindConfig