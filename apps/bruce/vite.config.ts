import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

export default defineConfig({
	base: 'https://fit-test.netlify.app/smash/',
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
    // exclude: ['path', 'fs', 'os', 'perf_hooks', 'util'],
  },
})