import { createApp, type Component } from 'vue'
import { createPinia } from 'pinia'
import { useOwners, useOfferama } from "gygax"

import SearchEngine from './@/SearchEngine.vue'
import SolarPlus from './@/SolarPlus.vue'
import FlugPlus from './@/FlugPlus.vue'

import './style.css'

interface LaunchOptions {
	mount: string;
	root: Component;
}
const pinia = createPinia()

function launch (i: LaunchOptions) {
	const $ = document.querySelector(i.mount) as HTMLElement
	const { slug = null, spotlight = false } = $?.dataset ?? {}

	if ($) {
		const app = createApp(i.root, { slug, spotlight })
		app.use(pinia)
		app.mount(i.mount)
	}
}
launch({ mount: '#offer-search', root: SearchEngine })
launch({ mount: '#hotel-offerama', root: SolarPlus })
launch({ mount: '#flight-offerama', root: FlugPlus })

useOwners().init()
useOfferama().init()