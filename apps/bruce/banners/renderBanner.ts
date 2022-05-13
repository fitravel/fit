import { queue, replace, map, isExt } from "fn"
import { readdir } from "fs/promises"
import { type Banner } from "gygax"
import { createDir, downloadFile, editFile, extractZip, uploadToCloudinary, type UploadApiResponse } from "ntl"
import { HEAD_SCRIPT, TRACKING_SCRIPT } from "."
import { createIndex } from "./createIndex"

export async function renderBanner (i: Banner): Promise<any> {
	const path  = `./public/${i.path}`
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

export default renderBanner