const vue = require('@vitejs/plugin-vue')
const path = require('path')
const ViteComponents = require('vite-plugin-components').default

module.exports = function () {
	return ({
		plugins: [
			vue(),
			ViteComponents({
				globalComponentsDeclaration: true
			})
		],
		define: { 'process.env': {} },
		resolve: {
			alias: {
				'~': path.resolve(__dirname, './src'),
				'@': path.resolve(__dirname, './src')
			},
		}
	})
}