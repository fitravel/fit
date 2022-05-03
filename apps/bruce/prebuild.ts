import { copyFile } from "fs/promises"
import { resetDir } from "ntl"
import { renderRoot, BASE_PATH } from "./banners"

const copy = (file: string) => {
	const newFile = `${BASE_PATH}/${file}`
	console.log(`Copying ${file} to ${newFile}`)
	return copyFile(file, newFile)
}

try {
	resetDir(BASE_PATH).then(async () => {
		await copy('./favicon.ico')
		await copy('./robots.txt')

		console.log('Rendering banner tree...')
		return renderRoot()
	})
}
catch (e) {
	console.error(e)
}