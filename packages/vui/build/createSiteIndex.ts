import { strif } from "geri"
import { fileExists } from "freki"
import renderFile from "./renderFile"

export const createSiteIndex = renderFile('./index.html', async ({ fathom, kit, title }) => {
	const isFav = await fileExists('./src/favicon.ico')
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				${strif(isFav, '<link rel="icon" href="/favicon.ico"/>')}
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<link href="https://api.fitravel.info/fonts/${kit}.css" rel="stylesheet">
				${strif(fathom, `<script data-spa="auto" src="https://cdn.usefathom.com/script.js" data-site="${fathom}" defer></script>`)}
				<title>${title}</title>
			</head>
			<body>
				<div id="app"></div>
				<script type="module" src="/src/main.ts"></script>
			</body>
		</html>
	`
})

export default createSiteIndex