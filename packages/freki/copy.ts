import { copyFile } from "fs/promises"
import createLogged from "./createLogged"

export const copy = createLogged(copyFile, (oldFile, newFile) => `✂︎ Copying ${oldFile} → ${newFile}`)

export default copy