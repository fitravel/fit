import { isNil } from "geri"

export const nifdef = (i: any, fallback?: number) => isNil(i) ? fallback : +i

export default nifdef