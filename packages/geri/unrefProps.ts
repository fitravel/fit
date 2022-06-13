import { get } from "@vueuse/core"
import { mapObjIndexed } from "ramda"
import { type R } from "."

export const unrefProps = (x: R) => mapObjIndexed(i => get(i))(x)

export default unrefProps