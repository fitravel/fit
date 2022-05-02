import { compose, type Functor } from "ramda"

export function funk <T, Y = T>(...args: any[]) {
	//@ts-ignore
	const fn = compose(...args)
	return fn as (i: T) => Y
}

export default funk