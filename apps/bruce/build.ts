import { indent, trim, o, isNil, echo } from "fn"
import { copyFile } from "fs/promises"
import { createFile, resetDir, createDir, move, removeDir, cmd, fileExists } from "ntl"
import { renderRoot } from "./banners"
import config from "./app.config"
import { exec } from "child_process"
import { type AppConfig } from "vui/defineApp"



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

const copy = (file: string) => {
	const oldFile = `./${file}`
	const newFile = `./public/${file}`
	console.log(`Copying ${oldFile} to ${newFile}`)
	return copyFile(oldFile, newFile)
}

async function buildSite () {
	const hook   = process.argv?.[2]
	const noHook = isNil(hook)

	async function run () {
		if (noHook || hook === 'before') {
			if (await fileExists('./dist')) {
				await removeDir('./dist')
			}
			await resetDir('./public')
			await createTailwindConfig(config)
			await createPostcssConfig()
			await createIndex(config)

			await copy('favicon.ico')
			await copy('robots.txt')
	
			if (!isNil(config?.beforeBuild)) {
				await config.beforeBuild(config)
			}
		}
		if (noHook || hook === 'vite') {
			await cmd('vue-tsc --noEmit && vite build').then(console.log)
		}
		if (noHook || hook === 'after') {
			if (!isNil(config?.afterBuild)) {
				await config.afterBuild(config)
			}
		}
		if (noHook || hook === 'cleanup') {
			await removeDir('./public')
			await removeDir('./index.html')
			await removeDir('./tailwind.config.js')
			await removeDir('./postcss.config.js')
		}
	}

	try {
		await run()
	}
	catch (e) {
		console.error(e)
	}
}

buildSite()