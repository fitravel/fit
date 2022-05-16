import { createFile } from "freki"
import config from "../app.config"
import { trim } from "geri"

export const createIndex = (path: string, content: string = '') => {
	const index = `${path}/index.html`
	const html  = trim(`
		<!doctype html>
		<html>
		<head>
			<title>bruce</title>
			<script data-auto="false" src="https://cdn.usefathom.com/script.js" data-site="${config.fathom}"></script>
		</head>
		<body>
			${content}
		</body>
		</html>
	`)
	return createFile(index, html)
}

export default createIndex