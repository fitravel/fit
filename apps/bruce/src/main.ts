import './index.css'

import FrontPage from "./views/FrontPage.vue"
// import StatPage from "./views/StatPage.vue"
import SourcePage from "./views/Test.vue"
import { createSite } from 'vui'

createSite({
	lock: 'bruce',
	hash: true,
	routes: [
		{ path: '/smash/', name: 'home', component: FrontPage },
		// { path: '/stats', name: 'stats', component: StatPage },
		{ path: '/smash/:slug', name: 'source', component: SourcePage }
	]
})