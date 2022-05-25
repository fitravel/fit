import { compose, head, last, o, split } from "ramda"
import { ifNil } from "./ifNil"

export const getExt = compose(
	ifNil(''),
	head, 
	split(/[\?#&]/),
	ifNil(''),
	last, 
	split('.')
) as (i: string) => string

export default getExt