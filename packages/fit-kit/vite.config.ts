import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import ViteComponents from 'vite-plugin-components'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'index.ts'),
			name: 'fit-kit',
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				// Provide global variables to use in the UMD build
				// Add external deps here
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
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
			'~': path.resolve(__dirname, './'),
			'@': path.resolve(__dirname, './')
		},
	}
})