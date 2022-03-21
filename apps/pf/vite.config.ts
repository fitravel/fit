import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import ViteComponents from 'vite-plugin-components'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
	plugins: [
		vue(),
		ViteComponents({
			globalComponentsDeclaration: true
		}),
		AutoImport({
			include: [ /\.[tj]s$/, /\.vue\??/, /\.gql\??/ ],
			imports: [
				'vue',
				'vue-router',
				'pinia',
				'@vueuse/core'
			]
		}),
	],
	define: { 'process.env': {} },
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './src'),
			'@': path.resolve(__dirname, './src')
		},
	}
})