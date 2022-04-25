import { isNil } from "fn"
import { isValid } from "date-fns"

export const difdef = (i: any) => {
	const d = new Date(i)
	return isValid(d) ? d : undefined
}

export default difdef