import { compose, head, last, split } from "ramda"

export const getExt = compose(head, split(/[\?#&]/), last, split('.')) as (i: string) => string

export default getExt