import { funk, echo } from "geri"
import { readFile, writeFile } from "fs/promises"
import createLogged from "./createLogged"

export const editFile = createLogged(
	async (path: string, edits: ((i: string) => string)[]) => {
		const file   = await readFile(path, 'utf8')
		const edited = funk<string>(edits)(file)
		return writeFile(path, edited)
	}, 
	(path: string) => `Editing file ${path}`
)

export default editFile