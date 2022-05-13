import { createDir, move, removeDir } from "ntl"

const smash = (i: string) => move(`./dist/${i}`, `./dist/smash/${i}`)

try {
	createDir('./dist/smash').then(async () => {
		await smash('index.html')
		await smash('assets')
		await removeDir('./public')
	})
}
catch (e) {
	console.error(e)
}