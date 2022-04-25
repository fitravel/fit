import { isNil } from "fn"

export const nifdef = (i: any, fallback?: number) => isNil(i) ? fallback : +i

export default nifdef