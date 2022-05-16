import { rename } from "fs/promises"
import { createLogged } from "./createLogged"

export const move = createLogged(rename, (a: string, b: string) => `Moving ${a} → ${b}`)

export default move