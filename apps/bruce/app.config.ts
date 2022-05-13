import { move, createDir } from "ntl"
import { defineApp, type AppConfig } from "vui/defineApp"
import { renderRoot } from "./banners"

const smash = (i: string) => move(`./dist/${i}`, `./dist/smash/${i}`)

const config = defineApp({ 
	title: 'bruce',
	janus: 'bruce',
	kit: 'hermes',
	baseURL: 'https://fit-test.netlify.app',
	fathom: 'ACFWSJMD',

	async beforeBuild () {
		console.log('Rendering banner tree...')
		await renderRoot()
	},
	async afterBuild () {
		await createDir('./dist/smash')
		await smash('index.html')
		await smash('assets')
	},

	routes: [
		// { path: '/smash/', name: 'home', component: FrontPage },
		// // { path: '/stats', name: 'stats', component: StatPage },
		// { path: '/smash/:slug', name: 'source', component: SourcePage }
	]
}) as AppConfig

export default config