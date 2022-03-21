import { get, type MaybeRef } from "@vueuse/core"
import { mapObjIndexed } from "ramda"
//@ts-ignore
export const getProps = (i: Record<string, MaybeRef<any>>) => mapObjIndexed((key, value) => get(value))(i)

export default getProps