import './index.css'

import config from "../site.config"
import { createSite } from 'vui'

createSite(config, [
	{ path: '/', view: 'Home' },
	{ path: '/login', view: 'Login' },
	{ path: '/user', view: 'User' },
	{ path: '/user/edit', view: 'EditUser' },
])