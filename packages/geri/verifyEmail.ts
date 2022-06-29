import { test } from "ramda"

export const verifyEmail = (email: string) => {
	if (!test(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)(email)) {
		throw 'Þetta er ekki gilt netfang'
	}
	return true
}

export default verifyEmail