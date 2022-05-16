import { Readable } from "stream"
import { Buffer } from "buffer"
import { isNil } from "geri"

export function toNodeStream (i: void|Response) {
	const { body } = i as Response
	if (isNil(body)) return null
	
	const reader = body.getReader()
	const stream = new Readable()

	stream._read = async () => {
		const load = await reader.read()
		stream.push(load.done ? null : Buffer.from(load.value))
	}
	return stream
}

export default toNodeStream