const HEAD_SCRIPT     = '<script data-auto="false" src="https://cdn.usefathom.com/script.js" data-site="ACFWSJMD"></script>'
const TRACKING_SCRIPT = '<script>window.fathom.trackPageview();</script>'

interface AppConfig {
	kit?: string;
	janus?: string;
	baseURL: string;
	fathom?: string;
	routes?: any[];
}

function defineApp (i: AppConfig): AppConfig {
	return i
}

export default defineApp({ 
	janus: 'bruce',
	kit: 'hermes',
	baseURL: 'https://fit-test.netlify.app',
	fathom: 'ACFWSJMD',


	routes: [
		// { path: '/smash/', name: 'home', component: FrontPage },
		// // { path: '/stats', name: 'stats', component: StatPage },
		// { path: '/smash/:slug', name: 'source', component: SourcePage }
	]
})