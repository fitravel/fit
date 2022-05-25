import { strif } from "geri"
import renderFile from "./renderFile"

export const createViteConfig = renderFile('./vite.config.ts', async ({ base }) => {
	const b = strif(base, i => `base: '${i}',`)

	return `
		import { defineConfig } from "vite"
		import vue from '@vitejs/plugin-vue'
		import * as path from 'path'

		export default defineConfig({
			${b}
			plugins: [
				vue()
			],
			define: { 'process.env': {} },
			resolve: {
				alias: {
					'~': path.resolve(__dirname, './src'),
					'@': path.resolve(__dirname, './src')
				},
			},
			optimizeDeps: {
				exclude: ['freki']
			}
		})
	`
})

export default createViteConfig