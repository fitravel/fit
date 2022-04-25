import { createFitWeb } from "vui"
import { FrontPage } from "@/views/FrontPage.vue"
import { StatPage } from "@/views/StatPage.vue"
import { SourcePage } from "@/views/SourcePage.vue"

createFitWeb({
	lock: 'bruce',
	routes: [
		{ path: '/', name: 'home', component: FrontPage },
		{ path: '/stats', name: 'stats', component: StatPage },
		{ path: '/:slug', name: 'source', component: SourcePage }
	]
})