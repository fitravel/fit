import { queue, replace, map, isExt } from "geri"
import { readdir } from "fs/promises"
import { type Banner } from "gygax"
import { createDir, downloadFile, editFile, extractZip, uploadToCloudinary, type UploadApiResponse } from "freki"
import { createIndex } from "./createIndex"
import config from '../app.config'

export async function createBanner (i: Banner): Promise<any> {
	const path  = `./public/${i.path}`
	const zip   = `${path}/banner.zip`
	const media = `${path}/media`
	const index = `${path}/index.html`

	await createDir(path)
	if (!isExt('zip')(i.file)) return createIndex(path, '')

	await downloadFile(zip)(i.file)
	await extractZip(zip)(path)

	const edits = [ 
		replace(/<\/head>/i, `    <script data-auto="false" src="https://cdn.usefathom.com/script.js" data-site="${config.fathom}"></script>\n    </head>`),
		replace(/<\/body>/i, `<script>window.fathom.trackPageview();</script></body>`),
		replace(/"imgLocalPath":"media\/"/gi, '"imgLocalPath":""') 
	]
	const createUpload = (i: string) => {
		const file = `${media}/${i}`
		const options = {
			folder: 'bruce',
			overwrite: false,
			use_filename: true,
			unique_filename: false,
		}
		return async () => {
			const response = await uploadToCloudinary(file, options)
			const { secure_url: url = file } = response as UploadApiResponse
			edits.push(replace(new RegExp(i, 'gi'), url))
		}
	}
	const files   = await readdir(media)
	const uploads = map(createUpload)(files)
	const edit    = () => editFile(index, edits)

	return queue([ ...uploads, edit ])
}

export default createBanner