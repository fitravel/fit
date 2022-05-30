import { get, type MaybeRef } from "@vueuse/core"
import { mapObjIndexed } from "geri"
//@ts-ignore
export const getProps = (i: Record<string, MaybeRef<any>>) => mapObjIndexed((key, value) => get(value))(i)

export default getProps