import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'vite-plugin-components'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
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
				'@vueuse/core',
				'pinia'
			]
		}),
	],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
