import './index.css'

import config from "../site.config"
import { createSite } from 'vui/@'

import Home from "./views/Home.vue"
import Login from "./views/Login.vue"
import Users from "./views/Users.vue"
import EditUser from "./views/EditUser.vue"
import Register from "./views/Register.vue"

createSite(config, [
	{ path: '/', component: Home },
	// { path: '/contact', view: 'Contact' },
	{ path: '/login', component: Login },
	{ path: '/users', component: Users },
	{ path: '/user/:id', component: EditUser },
	{ path: '/register', component: Register }
])