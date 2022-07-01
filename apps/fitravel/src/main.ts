import './index.css'

import config from "../site.config"
import { createSite } from 'vui/@'

import Home from "./views/Home.vue"
import Login from "./views/Login.vue"
import Users from "./views/Users.vue"
import EditUser from "./views/EditUser.vue"
import Register from "./views/Register.vue"
import Terms from "./views/Terms.vue"
import Dashboard from "./views/Dashboard.vue"
import EditProduct from "./views/EditProduct.vue"
import Schedule from "./views/Schedule.vue"

createSite(config, [
	{ path: '/', component: Home },
	{ path: '/login', component: Login },
	{ path: '/users', component: Users },
	{ path: '/user', component: EditUser },
	{ path: '/user/:id', component: EditUser },
	{ path: '/register', component: Register },
	{ path: '/terms', component: Terms },
	{ path: '/dash', component: Dashboard },
	{ path: '/product', component: EditProduct },
	{ path: '/product/:id', component: EditProduct },
	{ path: '/schedule', component: Schedule },
	{ path: '/schedule/:id', component: Schedule }
])