import { createDir, downloadFile, extractZip, resetDir } from "ntl"
import { type BannerSlot, fetchBannerSources, type BannerSource, type Banner } from "gygax"
import { map, uploadToCloudinary, replace, compose } from "fn"
import { Queue } from "queue-promise"
import { readdir, readFile } from "fs/promises"

const BASE = `./dist`

async function renderBanner (i: Banner): Promise<boolean> {
	const path  = BASE + i.path
	const zip   = `${path}/banner.zip`
	const media = `${path}/media`
	const index = `${path}/index.html`

	await createDir(path)

	if (i.ext !== '.zip') {
		return createFile(index, '')
	}
	await downloadFile(zip)(i.file)
	await extractZip(zip)(path)

	// let html = await readFile(index, 'utf8').then(injectTracking)
	const mutations = [ 
		replace(/<\/head>/i, `    <script data-auto="false" src="https://cdn.usefathom.com/script.js" data-site="ACFWSJMD"></script>\n    </head>`),
		replace(/<\/body>/i, `<script>window.fathom.trackPageview();</script></body>`),
		replace(/"imgLocalPath":"media\/"/gi, '"imgLocalPath":""') 
	]

	function upload (i: string) {
		const path = `${media}/${i}`
		const options = {
			folder: 'bruce',
			overwrite: false,
			use_filename: true,
			unique_filename: false,
		}
		return async () => {
			const response = await uploadToCloudinary(path, options)
			const mutation = replace(new RegExp(i, 'gi'), response?.secure_url ?? i)
			mutations.push(mutation)
		}
	}
	const files   = await readdir(media)
	const queue   = new Queue({ concurrent: 1, interval: 500 })
	const uploads = map(upload)(files)

	queue.enqueue(uploads)

	return new Promise((resolve, reject) => {
		function onError (e: any) {
			console.log(e)
			reject(false)
		}
		queue.on('error', onError)
		queue.on('finish', async () => {
			console.log('')
			await applyToFile(index, mutations).catch(onError)
			resolve(true)
		})
	})

}
async function renderSlot (i: BannerSlot): Promise<boolean> {
	const path = BASE + i.path
	await createDir(path)
	await Promise.all(map(renderBanner)(i?.banners ?? []))
	return createFile(`${path}/index.html`)
}
async function renderSource (i: BannerSource): Promise<boolean> {
	await createDir(BASE + i.path)
	await Promise.all(map(renderSlot)(i?.slots ?? []))
}

async function init () {
	await resetDir(BASE)
	const sources = await fetchBannerSources()
	await Promise.all(map(renderSource)(sources))
}
