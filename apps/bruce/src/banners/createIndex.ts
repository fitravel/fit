import { writeFile } from "fs/promises"
import { HEAD_SCRIPT, BASE_URL } from "./banners.config"

export const createIndex = (path: string, body: string = '', css: string = '') => {
	const index = `${path}/index.html`
	console.log(`Creating index file ${index}`)
	return writeFile(index, (
		`<!doctype html>
		<html>
		<head>
			<title>bruce</title>
			<script>
				${css}
			</script>
			${HEAD_SCRIPT}
		</head>
		<body>
			${body}
		</body>
		</html>`
	))
}

export default createIndex