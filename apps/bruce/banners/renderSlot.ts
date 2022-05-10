import { type Banner, type BannerSlot } from "gygax"
import { renderBanner } from "./renderBanner"
import { createBranch } from "./createBranch"
import { BASE_URL } from "."
import { isEmpty } from "fn"

export const renderSlot = createBranch<BannerSlot, Banner>({
	path: i => i.path,
	children: i => isEmpty(i.banners) ? [ i.fallback ] : i.banners,
	child: renderBanner,
	index: ({ banners, fallback, slug, source, width, height }) => `
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
		
		<script>
			var a = ${JSON.stringify(banners)}.filter(function (i) {
				return i ? (new Date(i.startDate) <= new Date()) && (new Date(i.endDate) >= new Date()) : false;
			});
			var b = ${JSON.stringify(fallback)};
			var i = a.length > 0 ? a[Math.floor(Math.random() * a.length)] : b;
			
			function onBannerClick () {
				window.fathom.trackGoal('MD26GCVI', 0);
				window.open(i.url);
			}
			
			document.getElementById("banner").src = "${BASE_URL}/${source}/${slug}/" + i.id + "/";
		</script>
	`
})

export default renderSlot