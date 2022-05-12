import { mergeDeepLeft, funk } from "fn"

type R = Record<string, any>

export function configTailwind (kit: string, config: R) {
	const exts = '**/*.{vue,js,ts,jsx,tsx}'
	const content = {
		content: [
			// `vui/${kit}/${exts}`,
			// `vui/base/${exts}`,
			// `./src/${exts}`,
			// './index.html'
		]
	}
	return funk<R>([
		mergeDeepLeft(config),
		mergeDeepLeft(import(/* @vite-ignore */`vui/${kit}/tailwind.config`)),
		mergeDeepLeft(import('vui/base/tailwind.config'))
	])(content)
}

export default configTailwind