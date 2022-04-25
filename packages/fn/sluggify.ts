import { compose, replace, toLower, trim } from "ramda"
import icesafe from "./icesafe"

export const sluggify = compose(replace(/[-_–—]+/g, '-'), replace(/\s/g, '-'), icesafe, toLower, trim)

export default sluggify