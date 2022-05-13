import { funk, echo } from "fn"
import { readFile, writeFile } from "fs/promises"

export const editFile = async (path: string, edits: ((i: string) => string)[]) => {
	const file   = await readFile(path, 'utf8')
	const edited = funk<string>(edits)(file)
	return writeFile(path, edited).then(echo(`Write successful: File ${path} has been edited`))
}

export default editFile