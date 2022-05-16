import { remove } from "./remove"
import { createDir } from "./createDir"
import { thunk } from "geri"

export function resetDir (path: string) {
	return remove(path).then(thunk(createDir)(path))
}

export default resetDir