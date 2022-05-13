import { echo } from "fn"
import { rename } from "fs/promises"

export async function move (currentPath: string, newPath: string) {
	console.log(`Moving ${currentPath} to ${newPath}`)
	return rename(currentPath, newPath).catch(console.error).then(echo(`Write successful: ${currentPath} has been moved to ${newPath}`))
}

export default move