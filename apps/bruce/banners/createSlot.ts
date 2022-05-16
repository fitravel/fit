import { type Banner, type BannerSlot } from "gygax"
import { createBanner } from "./createBanner"
import { createBranch } from "./createBranch"
import config from "../site.config"
import { createFile } from "freki"

const index = ({ banners, fallback, slug, source, width, height }) => `
	<style>
		* {
			margin: 0;
			padding: 0;
			overflow: hidden;
		}
		body {
			height: ${height}px;
			width: ${width}px;
		}
		article {
			cursor: pointer;
			height: ${height}px;
			width: ${width}px;
		}
		iframe {
			pointer-events: none;
			height: ${height}px;
			width: ${width}px;
			border: none;
		}
	</style>

	<article onClick="onBannerClick()">
		<iframe loading="lazy" id="banner"></iframe>
	</article>

	<script src="/script.js"></script>
`
const js = `
function pickRandom (a) {
	return a[Math.floor(Math.random() * a.length)] 
}

fetch('/slot.json').then(function (response) {
	var slot = response.json()
	var banners = slot.banners.filter(function (i) {
		return i ? (new Date(i.startDate) <= new Date()) && (new Date(i.endDate) >= new Date()) : false;
	});
	var banner = banners.length > 0 ? pickRandom(banners): slot.fallback;
	
	function onBannerClick () {
		window.fathom.trackGoal('MD26GCVI', 0);
		window.open(banner.url);
	}
	
	document.getElementById("banner").src = slot.path + "/" + banner.id;
})
`

export const createSlot = async (i: BannerSlot) => {
	const path     = i => i.path
	const children = i => [ ...i.banners, i.fallback ]
	const child    = createBanner

	await createFile(`${i.path}/slot.json`, JSON.stringify(i))
	await createFile(`${i.path}/script.js`, js)

	return createBranch<BannerSlot, Banner>({ path, children, child, index })
}

export default createSlot