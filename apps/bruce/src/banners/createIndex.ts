import { writeFile } from "fs/promises"

export const createIndex = (path: string, html: string) => {
	const index = `${path}/index.html`
	console.log(`Creating index file ${index}`)
	return writeFile(index, html)
}

export default createIndex