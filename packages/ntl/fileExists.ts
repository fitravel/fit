import { log } from "console"
import { access } from "fs/promises"

export async function fileExists (path: string) {
	const exists = await access(path).catch(() => null)
	return exists ? true : false
}

export default fileExists