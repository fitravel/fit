import { defineComponent } from "vue"
//@ts-ignore
import { createApp } from 'vue/dist/vue.esm-bundler.js'
import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from "vue-router"
import { createPinia } from 'pinia'
import { type SiteRoute, type SiteConfig } from "./defineSite"
import { map, omit } from "geri"

export async function createSite (config: SiteConfig, views: SiteRoute[] = []) {
	const createRoute = (i: SiteRoute) => {
		const name      = i.view
		const component = () => import(`/src/views/${i.view}.vue`) 
		return { ...omit(['view'])(i), name, component } as RouteRecordRaw
	}
	const root = defineComponent({
		template: `
			<div class="min-h-screen min-w-screen">
				<router-view/>
			</div>
		`
	})
	const app     = createApp(root)
	const routes  = map(createRoute)(views)
	const history = (config?.history ?? 'html5') === 'hash' ? createWebHashHistory() : createWebHistory() 
	const router  = createRouter({ routes, history })
	const store   = createPinia()
	
	app.use(router)
	app.use(store)
	app.mount('#app') 
}

export default createSite