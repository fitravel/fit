import { createDir } from "ntl"
import { map, queue, toThunk } from "fn"
import config from "./banners.config"
import createIndex from "./createIndex"

type R = Record<string, any>

export interface BranchOptions <T = R>{
	key: string;
	fn: (...args: any[]) => any;
	template: (i: T) => string;
}

export function createBranch <T = R, X = R>({ key, fn, template }: BranchOptions<T>) {
	return async (i: T) => {
		const { path = '', [key]: children = [] } = i as R
		const branch = config.BASE + path

		await createDir(branch)

		return queue([
			...map(toThunk(fn))(children as X[]),
			() => createIndex(branch, template(i))
		])
	}
}

export default createBranch