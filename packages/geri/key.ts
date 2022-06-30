import { curry, prop } from "ramda"
import { type R } from './'

export const key = curry((i: string, o: R) => prop<keyof typeof o, typeof o>(i, o))

export default key