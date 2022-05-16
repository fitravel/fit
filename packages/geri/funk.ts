import { compose, type Functor } from "ramda"

export function funk <T, Y = T>(arr: ((i: any) => any)[]) {
	//@ts-ignore
	const fn = compose(...arr)
	return fn as (i: T) => Y
}

export default funk