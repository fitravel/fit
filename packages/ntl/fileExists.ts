import { access } from "fs/promises"

export function fileExists (path: string) {
	return access(path).catch(e => false).then(i => true)
}

export default fileExists