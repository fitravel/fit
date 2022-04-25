import { createDir } from "ntl"
import { map, queue, toThunk, is } from "fn"
import config from "./banners.config"
import createIndex from "./createIndex"

type R = Record<string, any>
type Input<T, Y> = Y|((i: T) => Y)

export interface BranchOptions <T, Y>{
	children: Input<T, Y[]>;
	path: Input<T, string>;
	child: (...args: any[]) => any;
	index: Input<T, string>;
}

const callElse = <A, B>(i: A, args: any[]|any) => (is(Function)(i) ? i(...(Array.isArray(args) ? args : [ args ])) : i) as B

export function createBranch <T, Y>({ children, path, child, index }: BranchOptions<T, Y>) {
	return async (i: T) => {
		const branch = config.BASE + callElse<Input<T, string>, string>(path, i)

		await createDir(branch)

		return queue([
			...map(toThunk(child))(callElse<Input<T, Y[]>, Y[]>(children, [ i ])),
			() => createIndex(branch, callElse<Input<T, string>, string>(index, i))
		])
	}
}

export default createBranch