import { writeFile } from "fs/promises"

export const createIndex = (path: string, html: string = '', css: string = '') => {
	const index    = `${path}/index.html`
	console.log(`Creating index file ${index}`)
	return writeFile(index, (
		`<!doctype html>
		<html>
		<head>
			<title>bruce</title>
			<style>
				${css}
			</style>
			<script data-auto="false" src="https://cdn.usefathom.com/script.js" data-site="ACFWSJMD" defer></script>
		</head>
		<body>
			${html}
		</body>
		</html>`
	))
}

export default createIndex