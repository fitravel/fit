const HEAD_SCRIPT     = '<script data-auto="false" src="https://cdn.usefathom.com/script.js" data-site="ACFWSJMD"></script>'
const TRACKING_SCRIPT = '<script>window.fathom.trackPageview();</script>'

export default { 
	janus: 'bruce',
	kit: 'hermes',
	baseURL: 'https://fit-test.netlify.app',


	routes: [
		{ path: '/smash/', name: 'home', component: FrontPage },
		// { path: '/stats', name: 'stats', component: StatPage },
		{ path: '/smash/:slug', name: 'source', component: SourcePage }
	]

	HEAD_SCRIPT, 
	TRACKING_SCRIPT,
}