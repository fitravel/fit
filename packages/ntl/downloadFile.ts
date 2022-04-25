import { curry } from "fn"
import { createWriteStream } from "fs"
import { toNodeStream } from "./toNodeStream"
import { fileExists } from "./fileExists"

export const downloadFile = curry(async (path: string, url: string): Promise<undefined> => {
	console.log(`Downloading file ${url} to ${path}`)
	
	return new Promise(async (resolve, reject) => {
		if (await fileExists(path)) onError(`Download cancelled: File ${path} already exists`)
		
		const stream = await fetch(url).catch(reject).then(toNodeStream)
		const file   = createWriteStream(path)

		stream.pipe(file)

		file.on('error', reject)
		file.on('finish', () => {
			console.log(`Download successful: File ${path} has been saved`)
			resolve()
		})
	}) 
})

export default downloadFile