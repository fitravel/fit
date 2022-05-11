import { removeDir } from "./removeDir"
import { createDir } from "./createDir"
import { thunk } from "fn"

export function resetDir (path: string) {
	return removeDir(path).then(thunk(createDir)(path)).catch(console.error)
}

export default resetDir