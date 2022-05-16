import { replace, map } from "ramda"
import funk from "./funk"

type R = [RegExp, string]

export function icesafe (s: string): string {
	const replacements: R[] = [
		[/Á/g, 'A'], [/É/g, 'E'], [/Í/g, 'I'], [/Ó/g, 'O'], [/Ú/g, 'U'], [/Ý/g, 'Y'],
		[/Ð/g, 'D'], [/Æ/g, 'AE'], [/Þ/g, 'TH'], [/Ö/g, 'OU'],
		[/á/g, 'a'], [/é/g, 'e'], [/í/g, 'i'], [/ó/g, 'o'], [/ú/g, 'u'], [/ý/g, 'y'],
		[/ð/g, 'd'], [/æ/g, 'ae'], [/þ/g, 'th'], [/ö/g, 'ou']
	]
	const mutations = map(([rgx, str]: R) => replace(rgx, str))(replacements)
	return funk<string>(mutations)(s)
}

export default icesafe