import { createDir } from "freki"
import { map, queue, thunk, is, isNil } from "geri"
import createIndex from "./createIndex"

type R = Record<string, any>
type Input<T, Y> = Y|((i: T) => Y)

export interface BranchOptions <T, Y>{
	children: Input<T, Y[]>;
	path: Input<T, string>;
	child: (...args: any[]) => any;
	index?: Input<T, string>;
}

const callElse = <A, B>(i: A, args: any[]|any) => (is(Function)(i) ? i(...(Array.isArray(args) ? args : [ args ])) : i) as B

export function createBranch <T, Y>({ children, path, child, index }: BranchOptions<T, Y>) {
	return async (i?: T) => {
		const string = (x: Input<T, string>) => callElse<Input<T, string>, string>(x, i ?? '')
		const array  = (a: Input<T, Y[]>) => callElse<Input<T, Y[]>, Y[]>(a, isNil(i) ? [] : [ i ])
		const branch = `./public/${string(path)}`

		await createDir(branch)

		const tasks = [
			...map(thunk(child))(array(children)),
			isNil(index) ? () => {} : () => createIndex(branch, string(index))
		]
		return queue(tasks, { concurrent: 3 })
	}
}

export default createBranch