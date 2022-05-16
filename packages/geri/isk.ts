import money from "./money"

export function isk (n: number, decimals = 0): string {
	const symbol             = 'kr.'
	const thousandsSeparator = '.'
	const decimalSeparator   = ','
	const spaceBetween       = true
	const symbolBefore       = false

	return money(n, {
		decimals, decimalSeparator, 
		spaceBetween, symbol, symbolBefore, 
		thousandsSeparator
	})
}

export default isk