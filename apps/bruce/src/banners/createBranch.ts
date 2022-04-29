import { createDir } from "ntl"
import { map, queue, thunk, is } from "fn"
import { BASE_PATH } from "./banners.config"
import createIndex from "./createIndex"

type R = Record<string, any>
type Input<T, Y> = Y|((i: T) => Y)

export interface BranchOptions <T, Y>{
	children: Input<T, Y[]>;
	path: Input<T, string>;
	child: (...args: any[]) => any;
	index: Input<T, string>;
	style: Input<T, string>;
}

const callElse = <A, B>(i: A, args: any[]|any) => (is(Function)(i) ? i(...(Array.isArray(args) ? args : [ args ])) : i) as B

export function createBranch <T, Y>({ children, path, child, index, style }: BranchOptions<T, Y>) {
	return async (i: T) => {
		const string = (x: Input<T, string>) => callElse<Input<T, string>, string>(x, i)
		const array  = (a: Input<T, Y[]>) => callElse<Input<T, Y[]>, Y[]>(a, [ i ])
		const branch = BASE_PATH + string(path)

		await createDir(branch)

		return queue([
			...map(thunk(child))(array(children)),
			() => createIndex(branch, string(index), string(style))
		])
	}
}

export default createBranch