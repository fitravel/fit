import { curry } from "geri"
import { createWriteStream } from "fs"
import { toNodeStream } from "./toNodeStream"
import { fileExists } from "./fileExists"
import logger from "./logger"

export const downloadFile = curry(async (path: string, url: string): Promise<void> => {
	const { log, dim, error,  } = logger()
	log(`Downloading file ${url} → ${path}`)
	
	return new Promise(async (resolve, reject) => {
		if (await fileExists(path)) {
			error(`Download cancelled: File ${path} already exists`)
			reject()
		}
		const stream = await fetch(url).catch(reject).then(toNodeStream)
		const file   = createWriteStream(path)
		
		stream?.pipe?.(file)

		file.on('error', reject)
		file.on('finish', () => {
			dim(`...done`)
			resolve()
		})
	}) 
})

export default downloadFile