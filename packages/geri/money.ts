import { replace, slice } from 'ramda'

export function money (n: number, {
	symbol = '$',
	thousandsSeparator = ',',
	decimalSeparator = '.',
	decimals = 2,
	spaceBetween = false,
	symbolBefore = true
} = {}): string {
	const r = /(\d{3})(?=\d)/g
	//@ts-ignore
	const f = parseFloat(n)
	const d = (-1) - decimals
	const _ = spaceBetween ? ' ' : ''
	const A = symbolBefore ? `${symbol}${_}` : ''
	const Z = symbolBefore ? '' : `${_}${symbol}`

	if (!isFinite(f) || (!f && f !== 0)) {
		return ''
	}
	else {
		const $000cc = replace('.', decimalSeparator, Math.abs(f).toFixed(decimals))
		const $000__ = decimals ? slice(0, d, $000cc) : $000cc
		const ____cc = decimals ? slice(d, Infinity, $000cc) : ''
		const x000__ = $000__.length % 3
		//@ts-ignore
		const $_____ = x000__ > 0 ? slice(0, x000__, $000__) + ($000__.length > 3 ? thousandsSeparator : '') : ''
		const _000__ = replace(r, `$1${thousandsSeparator}`, slice(x000__, Infinity, $000__))

		return `${A}${$_____}${_000__}${____cc}${Z}`
	}
}	

export default money