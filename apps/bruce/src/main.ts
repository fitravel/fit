import './index.css'

import config from "../site.config"
import { createSite } from 'vui'

createSite(config, [
	{ path: '/smash/', view: 'FrontPage' },
	// { path: '/stats', name: 'stats', component: StatPage },
	// { path: '/smash/:slug', name: 'source', component: SourcePage }
])