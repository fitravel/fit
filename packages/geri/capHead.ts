import { head, o, tail, toUpper } from "ramda"

export const capHead = (i: string) => `${o(toUpper, head)(i as unknown as [])}${tail(i)}`

export default capHead