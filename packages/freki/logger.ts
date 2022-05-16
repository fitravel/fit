import { thunk } from "../geri"

let no = 0

export function logger () {
	const n = no++

	const log       = (i: any) => console.log(`[${n}]\t${i}`)
	const echo      = thunk(log)
	const dim       = (i: any) => console.log('\x1b[2m%s\x1b[0m', `[${n}]\t${i}`)
	const dimEcho   = thunk(dim)
	const error     = (e: any) => { console.error(`[${n}]\tERROR!`); throw e }
	const echoError = thunk(error)

	return { log, echo, dim, dimEcho, error, echoError }
}

export default logger