import { createFile } from "ntl"
import { HEAD_SCRIPT } from "."
import { trim } from "fn"

export const createIndex = (path: string, content: string = '') => {
	const index = `${path}/index.html`
	const html  = trim(`
		<!doctype html>
		<html>
		<head>
			<title>bruce</title>
			${HEAD_SCRIPT}
		</head>
		<body>
			${content}
		</body>
		</html>
	`)
	return createFile(index, html)
}

export default createIndex