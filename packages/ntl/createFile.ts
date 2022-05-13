import { echo } from "fn"
import { writeFile } from "fs/promises"

export const createFile = async (path: string, content: string = '') => {
	console.log(`Attempting to create file ${path}`)
	return writeFile(path, content).catch(console.error).then(echo(`Write successful: File ${path} created`))
}