import { indent, trim, o } from "fn"
import { copyFile } from "fs/promises"
import { createFile, resetDir } from "ntl"
import { renderRoot } from "./banners"
import config from "./app.config"



export async function createTailwindConfig (config: AppConfig) {
	const exts = '**/*.{vue,js,ts,jsx,tsx}'
	const content = `
		module.exports = {
			content: [
				'vui/${config.kit}/${exts}',
				'vui/base/${exts}',
				'./src/${exts}',
				'./index.html'
			]
		}
	`
	return createFile('./tailwind.config.js', o(trim, indent(0))(content))
}
export async function createPostcssConfig () {
	const content = `
		module.exports = {
			plugins: {
				tailwindcss: {},
				autoprefixer: {},
			},
		}
	`
	return createFile('./postcss.config.js', o(trim, indent(0))(content))
}
export async function createIndex (config: AppConfig) {
	const content = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8"/>
				<link rel="icon" href="/favicon.ico"/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<!--<link href="https://fonts.googleapis.com/css2?family=Bungee+Shade&display=swap" rel="stylesheet">-->
				<link href="https://api.fitravel.info/fonts/${config.kit}.css" rel="stylesheet">
				<script data-spa="auto" src="https://cdn.usefathom.com/script.js" data-site="${config.fathom}" defer></script>
				<title>Vite App</title>
			</head>
			<body>
				<div id="app"></div>
				<script type="module" src="/src/main.ts"></script>
			</body>
		</html>
	`
	await createFile('./index.html')
}

const copy = (file: string) => {
	const oldFile = `./${file}`
	const newFile = `./public/${file}`
	console.log(`Copying ${oldFile} to ${newFile}`)
	return copyFile(oldFile, newFile)
}

try {
	resetDir('./public').then(async () => {
		await createTailwindConfig(config)

		await copy('favicon.ico')
		await copy('robots.txt')

		console.log('Rendering banner tree...')
		await renderRoot()
	})
}
catch (e) {
	console.error(e)
}