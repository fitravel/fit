import removeDir from "./removeDir"
import createDir from "./createDir"

export function resetDir (path: string) {
	return removeDir(path).then(() => createDir(path))
}

export default resetDir