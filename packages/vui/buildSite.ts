import { copy, createDir, logHeading, remove, terminal } from "freki"
import { queue, Task, isNil } from "geri"
import { createPostcssConfig } from "./createPostcssConfig"
import { createSiteIndex } from "./createSiteIndex"
import { createTailwindConfig } from "./createTailwindConfig"
import { BuildHook, BuildHookFn, BuildHooks } from "./defineSite"

export async function buildSite (hooks: BuildHooks = {}) {
	const config = await import('./site.config')
	const phase  = process.argv?.[2]

	const hook = async (i: BuildHook) => isNil(hooks?.[i]) ? undefined : (hooks[i] as BuildHookFn)(config)
	const copyToPublic = (file: string) => copy(`./src/${file}`, `./public/${file}`)
	const build = (i: string, tasks: Task[]) => {
		if (isNil(phase) || phase === i) return queue([
			() => logHeading(`BUILD ${i}`),
			...tasks
		])
	}

	await build('init', [
		() => hook('beforeInit'),
		() => Promise.all([
			remove('./dist'),
			createTailwindConfig(config),
			createPostcssConfig(),
			createSiteIndex(config),
			createDir('./public'),
		]),
		() => Promise.all([
			copyToPublic('favicon.ico'),
			copyToPublic('robots.txt')
		]),
		() => hook('afterInit')
	])
	await build('app', [
		() => hook('beforeApp'),
		() => terminal('vue-tsc --noEmit && vite build').then(console.log),
		() => hook('afterApp')
	])
	await build('cleanup', [
		() => hook('beforeCleanup'),
		() => Promise.all([
			remove('./public'),
			remove('./index.html'),
			remove('./tailwind.config.js'),
			remove('./postcss.config.js')
		]),
		() => hook('afterCleanup')
	])
}

export default buildSite