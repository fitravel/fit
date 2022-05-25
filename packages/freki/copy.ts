import { copyFile } from "fs/promises"
import createLogged from "./createLogged"

export const copy = createLogged(copyFile, (oldFile: string, newFile: string) => `Copying ${oldFile} → ${newFile}`)

export default copy