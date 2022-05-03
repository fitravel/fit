import { find, includes, map, repeat, times } from "ramda"
import { queue } from "fn"

(async () => {
	let us = 0, them = 0

	const fn = () => fetch('https://mbl.is/frettir').then(i => i.text())
	const loads = await Promise.all(times(fn, 100))
	console.log(loads)
	//@ts-ignore
	const foo   = map(includes('https://bruce.one/mbl/1100x50-tikker-lg/'))(loads)
	console.log(foo)
})()