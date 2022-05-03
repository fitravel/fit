import { Queue, type QueueOptions, type TaskFactory } from "queue-promise"

export function queue (tasks: readonly TaskFactory[], options: QueueOptions = {}) {
	const q = new Queue({ concurrent: 1, interval: 1000, ...options })

	q.enqueue(tasks)

	return new Promise((resolve, reject) => {
		q.on('reject', reject)
		q.on('resolve', resolve)
	})
}

export default queue