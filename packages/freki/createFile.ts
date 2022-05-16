import { echo } from "geri"
import { writeFile } from "fs/promises"
import createLogged from "./createLogged"

export const createFile = createLogged(writeFile, (path: string) => `Creating file ${path}`)

export default createFile