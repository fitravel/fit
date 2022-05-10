import { Queue, type QueueOptions, type TaskFactory } from "queue-promise"
import { head, isEmpty, o, tail } from "ramda"

type Tk = (() => Promise<any>)

export async function queue (tasks: Tk[]) {
	const i: any[] = []
	const fn = async (tasks: Tk[]): Promise<void> => {
		if (isEmpty(tasks)) return;
		const task = head(tasks) as Tk
		i.push(await task())
		return o(fn, tail)(tasks)
	}
	await fn(tasks)
	return i
}


// export function dqueue (tasks: readonly TaskFactory[], options: QueueOptions = {}) {
// 	const q = new Queue({ concurrent: 1, interval: 1000, ...options })

// 	q.enqueue(tasks)

// 	return new Promise((resolve, reject) => {
// 		q.on('reject', reject)
// 		q.on('resolve', resolve)
// 	})
// }

export default queue