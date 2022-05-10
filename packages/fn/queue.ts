import { take, isEmpty, o, drop, map } from "ramda"
import { funk } from "./funk"
import { trigger } from "./trigger"
import { delay } from "./delay"

export type Task = (() => Promise<any>)
export interface QueueOptions {
	concurrent?: number;
	interval?: number;
}

export async function queue (tasks: Task[], { concurrent = 1, interval = 0 }: QueueOptions = {}) {
	const resolved: any[] = []
	const fn = async (tasks: Task[]): Promise<void> => {
		if (isEmpty(tasks)) return;
		if (interval) await delay(interval)

		// const process = funk<Task[], Promise<any[]>>([ Promise.all,  ])
		const batch   = await Promise.all(o(map(trigger), take(concurrent))(tasks))

		resolved.push(...batch)
		
		return o(fn, drop(concurrent))(tasks)
	}
	await fn(tasks)
	return resolved
}

export default queue