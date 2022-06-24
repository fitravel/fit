import { copy, logHeading, remove, terminal, logger, resetDir } from "freki"
import { queue, Task, isNil, capHead, map, o, reject, includes } from "geri"
import { createPostcssConfig } from "./createPostcssConfig"
import { createSiteIndex } from "./createSiteIndex"
import { createTailwindConfig } from "./createTailwindConfig"
import { createViteConfig } from "./createViteConfig"
import { type BuildHook, type BuildHookFn, type BuildHooks, type SiteConfig } from "../defineSite"
import { readdir } from "fs/promises"

export async function buildSite (config: SiteConfig, hooks: BuildHooks = {}) {
	const phase = process.argv?.[2]

	const { log } = logger()
	const hook = async (i: string) => {
		const fn = hooks[i as BuildHook] as BuildHookFn
		return isNil(fn) ? undefined : fn(config)
	}
	const copyToPublic = (file: string): Promise<any> => copy(`./src/${file}`, `./public/${file}`)
	const buildPublic = () => resetDir('./public').then(async () => {
		const paths         = await readdir('./src')
		const whitelist     = [ 'api', 'views', 'index.css', 'main.ts', 'tailwind.css', '@' ]
		const isWhitelisted = (i: string) => includes(i)(whitelist)
		//@ts-ignore
 		const tasks         = o(map(copyToPublic), reject(isWhitelisted))(paths)
		 
		return Promise.all(tasks)
	})
	const buildConfigs = () => Promise.all([
		createViteConfig(config),
		createTailwindConfig(config),
		createPostcssConfig(config),
	])
	const buildEntryFiles = () => Promise.all([
		createSiteIndex(config)
	])
	const build = (i: string, tasks: Task[]) => {
		if (isNil(phase) || phase === i) return queue([
			() => logHeading(`BUILD ${i}`),
			() => hook(`before${capHead(i)}`),
			...tasks,
			() => hook(`after${capHead(i)}`)
		])
	}

	// START BUILD

	await build('init', [
		() => remove('./dist'),
 		buildConfigs,
		buildEntryFiles,
		buildPublic
	])
	await build('app', [
		() => terminal('vue-tsc --noEmit && vite build').then(log)
	])
	await build('cleanup', [
		() => Promise.all([
			remove('./public'),
			remove('./index.html'),
			remove('./tailwind.config.js'),
			remove('./postcss.config.js'),
			remove('./vite.config.ts')
		])
	])
}

export default buildSite