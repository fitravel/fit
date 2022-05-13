import { defineComponent } from "vue"
//@ts-ignore
import { createApp } from 'vue'
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router"
import { createPinia } from 'pinia'
import { type AppConfig } from "./defineApp"

export function createSite (config: AppConfig) {
	const app = createApp(defineComponent({
		template: `
			<div class="min-h-screen min-w-screen">
				<router-view/>
			</div>`
	}))
	if (config?.routes) {
		const router = createRouter({ 
			routes: config.routes, 
			history: createWebHistory()//config?.hash ?? false ? createWebHashHistory() : createWebHistory() 
		})
		app.use(router)
	}
	const store = createPinia()
	
	app.use(store)
	app.mount('#app') 
}

export default createSite