import { createFile } from "freki"
import { indent, o, trim, } from "geri"
import { type SiteConfig } from "../defineSite"

export function renderFile (path: string, fn: (config: SiteConfig) => Promise<string>) {
	return async (config: SiteConfig) => createFile(path, o(trim, indent(0))(await fn(config)))
}

export default renderFile