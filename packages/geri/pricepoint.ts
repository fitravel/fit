import { join } from "ramda"

export function pricepoint ({ adults = 1, children = 0, infants = 0 }, grammar = false, useInfants = true): string {
	return useInfants 
		?	join('', [
				`${adults} fullorð${adults === 1 ? 'inn' : (grammar ? 'nir' : 'na')}`,
				children || infants ? (children && infants ? ', ' : ' og ') : '',
				children ? `${children} b${children === 1 ? 'a' : 'ö'}rn${infants ? ' og ' : ''}` : '',
				infants ? `${infants} ungab${infants === 1 ? 'a' : 'ö'}rn` : ''
			]) 
		:	join('', [
				`${adults} fullorð${adults === 1 ? 'inn' : (grammar ? 'nir' : 'na')}`,
				children || infants ? ` og ${children + infants} b${children + infants === 1 ? 'a' : 'ö'}rn` : ''
			])
}
export default pricepoint