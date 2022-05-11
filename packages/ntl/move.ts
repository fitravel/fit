import { echo } from "fn"
import { rename } from "fs/promises"

export async function move (currentPath: string, newPath: string) {
	console.log(`Moving ${currentPath} to ${newPath}`)
	return rename(currentPath, newPath).catch(console.error).then(echo(`Move successful: ${currentPath} is now at ${newPath}`))
}

export default move