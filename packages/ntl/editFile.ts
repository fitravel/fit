import { readFile, writeFile } from "fs/promises"
import { compose } from "ramda"

export const editFile = async (path: string, edits: ((i: string) => string)[]) => {
	const file = await readFile(path, 'utf8')
	return writeFile(path, compose(...edits)(file))
}

export default editFile