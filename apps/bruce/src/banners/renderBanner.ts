import { UploadApiResponse } from "cloudinary"
import { queue, replace, uploadToCloudinary, map } from "fn"
import isExt from "fn/isExt"
import { readdir } from "fs/promises"
import { type Banner } from "gygax"
import { createDir, downloadFile, editFile, extractZip } from "ntl"
import { BASE_PATH, HEAD_SCRIPT, TRACKING_SCRIPT } from "./banners.config"
import createIndex from "./createIndex"

export async function renderBanner (i: Banner): Promise<any> {
	const path  = BASE_PATH + i.path
	const zip   = `${path}/banner.zip`
	const media = `${path}/media`
	const index = `${path}/index.html`

	await createDir(path)
	if (!isExt('zip')(i.file)) return createIndex(path, '')

	await downloadFile(zip)(i.file)
	await extractZip(zip)(path)

	const edits = [ 
		replace(/<\/head>/i, `    ${HEAD_SCRIPT}\n    </head>`),
		replace(/<\/body>/i, `${TRACKING_SCRIPT}</body>`),
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
			const { secure_url: url = i } = (await uploadToCloudinary(path, options)) as UploadApiResponse
			edits.push(
				replace(new RegExp(i, 'gi'), url)
			)
		}
	}
	const files = await readdir(media)
	return queue([
		...map(upload)(files),
		() => editFile(index, edits)
	])
}

export default renderBanner