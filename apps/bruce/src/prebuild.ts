import { copyFile } from "fs/promises"
import { resetDir } from "ntl"
import { renderRoot, BASE_PATH } from "./banners"

const copy = (file: string) => {
	console.log(`Copying ${file}`)
	return copyFile(`./src/${file}`, `${BASE_PATH}/${file}`)
}

resetDir(BASE_PATH).then(async () => {
	await copy('favicon.ico')
	await copy('robots.txt')

	console.log('Rendering banner tree...')
	return renderRoot()
})