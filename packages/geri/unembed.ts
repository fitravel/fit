import { path } from "ramda"

export function unembed (key: string|string[], o: Record<string, any>, fallback?: any) {
	return path([ '_embedded', ...(Array.isArray(key) ? key : [ key ]) ])(o) ?? fallback
}

export default unembed