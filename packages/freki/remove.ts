import rimraf from "rimraf"
import { createLogged } from "./createLogged"

export const remove = createLogged(
	(path: string) => new Promise<boolean>((resolve, reject) => {
		rimraf(path, (error: any) => error ? reject(false) : resolve(true))
	}),
	(path: string) => `Removing ${path}`
)

export default remove