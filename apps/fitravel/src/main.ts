import './index.css'

import config from "../site.config"
import { createSite } from 'vui/@'

createSite(config, [
	{ path: '/', view: 'Home' },
	{ path: '/contact', view: 'Contact' },
	{ path: '/login', view: 'Login' },
	{ path: '/users', view: 'Users' },
	{ path: '/user/:id', view: 'EditUser' },
])