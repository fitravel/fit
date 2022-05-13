import { compose, curry, filter, head, join, length, map, o, repeat, replace, sort, split, test } from "ramda"

export const indent = curry((indents: number, text: string) => {
	const lines = split('\n')(text)
	const tabs = o(join(''), repeat('\t'))(indents)

	const current = compose(
		join(''),
		repeat('\t'),
		head, 
		sort((a: number, b: number) => a - b), 
		map(o(length, replace(/[^\t]/g, ''))), 
		filter(test(/\w/))
	)
	return compose(
		join('\n'), 
		map(o(i => tabs + i, replace(current(lines), '')))
	)(lines)
})

export default indent