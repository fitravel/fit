import { slice, toString } from "ramda"

export function vanityPrice (amount: number) {
	const fn = (x: number) => (n: number) => n + x
	const roundTo = 100
	const mutate  = true
	const mutations = [
		fn(-1),
		fn(-1),
		fn(3),
		fn(2),
		fn(1),
		fn(0),
		fn(3),
		fn(2),
		fn(1),
		fn(0)
	]
	const calc = (n: number | string): number => {
		const reduced = Math.round(parseInt(n as string) / roundTo)

		if (!mutate) {
			return reduced * roundTo
		}

		const string  = toString(reduced)
		const digit   = parseInt(slice(-1, Infinity, string))
		const mutated = mutations[digit](reduced)
		const vane    = mutated * roundTo

		return vane < amount ? calc(vane + (roundTo * 3)) : vane
	}
	return calc(amount)
}

export default vanityPrice