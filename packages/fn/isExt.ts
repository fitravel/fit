import { curry, equals, o, replace } from "ramda"
import getExt from "./getExt"

export const isExt = curry((ext: string, path: string) => o(equals(replace(/\./g, '')(ext)), getExt)(path))

export default isExt