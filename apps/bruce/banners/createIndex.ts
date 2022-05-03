import { writeFile } from "fs/promises"
import { HEAD_SCRIPT } from "."

export const createIndex = (path: string, html: string = '') => {
	const index = `${path}/index.html`
	console.log(`Creating index file ${index}`)
	return writeFile(index, (
		`<!doctype html>
		<html>
		<head>
			<title>bruce</title>
			${HEAD_SCRIPT}
		</head>
		<body>
			${html}
		</body>
		</html>`
	))
}

export default createIndex