import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import ViteComponents from 'vite-plugin-components'

export default defineConfig({
	plugins: [
		vue(),
		ViteComponents({
			globalComponentsDeclaration: true
		})
	],
	define: { 'process.env': {} },
	resolve: {
		alias: {
			'~': path.resolve('./', './src'),
			'@': path.resolve('./', './src')
		},
	}
})