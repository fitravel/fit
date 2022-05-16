import { createFile } from "freki"
import { indent, o, trim, isNil } from "geri"
import { SiteConfig } from "./defineSite"

export async function createSiteIndex (config: SiteConfig) {
	const content = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				<link rel="icon" href="/favicon.ico"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<!--<link href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap" rel="stylesheet">-->
				<link href="https://api.fitravel.info/fonts/${config.kit}.css" rel="stylesheet">
				${!isNil(config?.fathom) ? `<script data-spa="auto" src="https://cdn.usefathom.com/script.js" data-site="${config.fathom}" defer></script>` : ''}
				<title>${config?.title}</title>
			</head>
			<body>
				<div id="app"></div>
				<script type="module" src="/src/main.ts"></script>
			</body>
		</html>
	`
	await createFile('./index.html', o(trim, indent(0))(content))
}

export default createSiteIndex