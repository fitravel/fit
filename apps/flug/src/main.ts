import './index.css'

import config from "../site.config"
import { createSite } from 'vui/@'

createSite(config, [
	{ path: '/', view: 'Home' }
])