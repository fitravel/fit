import { mkdir } from "fs/promises"
import { type MakeDirectoryOptions } from "fs"
import createLogged from "./createLogged";

type Options = MakeDirectoryOptions & { recursive: true; }

export const createDir = createLogged(
	(path: string, options: Options = { recursive: true }) => mkdir(path, options), 
	(path: string) => `Creating dir ${path}`
)

export default createDir