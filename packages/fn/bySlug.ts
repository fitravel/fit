import { curry } from "ramda"

export const bySlug = curry((slug: string, i: any) => `${i?.slug}` === slug)

export default bySlug