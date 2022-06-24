import { createApp } from "vue"
import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from "vue-router"
import { createPinia } from 'pinia'
import statePersistance from "pinia-plugin-persistedstate"
import { type SiteRoute, type SiteConfig } from "../defineSite"
import { map, omit } from "geri"
import { App } from "vui/@"

export async function createSite (config: SiteConfig, routes: RouteRecordRaw[] = []) {
	const app     = createApp(App)
	const history = (config?.history ?? 'html5') === 'hash' ? createWebHashHistory() : createWebHistory() 
	const router  = createRouter({ routes, history })
	const store   = createPinia()
	
	store.use(statePersistance)
	
	app.use(router)
	app.use(store)
	app.mount('#app') 
}

export default createSite