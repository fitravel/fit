import { createApp, defineComponent } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from 'pinia';
export function createFitWeb(config) {
    const app = createApp(defineComponent({
        template: `
			<div class="min-h-screen min-w-screen">
				<router-view/>
			</div>`
    }));
    const router = createRouter({
        routes: config.routes,
        history: createWebHistory()
    });
    const store = createPinia();
    app.use(store);
    app.use(router);
    app.mount('#app');
}
export default createFitWeb;
//# sourceMappingURL=createFitWeb.js.map