import { curry } from "ramda"

export const byId = curry((id: number, i: any) => +i?.id === id)

export default byId