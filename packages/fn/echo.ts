import { thunk } from "fn"

export const echo = thunk(console.log)

export default echo