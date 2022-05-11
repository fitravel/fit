import { defineComponent } from "vue"
//@ts-ignore
import { createApp } from 'vue/dist/vue.esm-bundler'
import type { RouteRecordRaw } from "vue-router"
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router"
import { createPinia } from 'pinia'

export interface FitWebConfig {
	lock: string;
	routes: RouteRecordRaw[];
	hash?: boolean;
}

export function createSite (config: FitWebConfig) {
	const app = createApp(defineComponent({
		template: `
			<div class="min-h-screen min-w-screen">
				<router-view/>
			</div>`
	}))
	const router = createRouter({ 
		routes: config.routes, 
		history: createWebHistory()//config?.hash ?? false ? createWebHashHistory() : createWebHistory() 
	})
	const store = createPinia()
	
	app.use(store)
	app.use(router)
	app.mount('#app') 
}

export default createSite