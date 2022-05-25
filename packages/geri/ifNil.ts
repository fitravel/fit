import { curry } from "ramda"

export const ifNil = curry((x: unknown, i: unknown) => i ?? x) 

export default ifNil