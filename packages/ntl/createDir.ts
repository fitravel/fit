import { mkdir } from "fs/promises"
import { type MakeDirectoryOptions } from "fs"

type Options = MakeDirectoryOptions & { recursive: true; }

export async function createDir (path: string, options: Options = { recursive: true }): Promise<any> {
	console.log(`Creating dir ${path}/`)
	return mkdir(path, options).catch(console.log)
}

export default createDir