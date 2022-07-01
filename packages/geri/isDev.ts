import { isNil } from "ramda"

export const isDev = () => isNil(process) ? false : !!(process?.env?.DEV ?? null)

export default isDev