import { thunk } from "geri"

export const echo = thunk(console.log)

export default echo