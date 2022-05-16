import { curry } from "ramda"
import AdmZip from "adm-zip"
import logger from "./logger"

export const extractZip = curry((zip: string, destination: string) => {
	const { log, dim, error } = logger()
	return new Promise((resolve, reject) => {
		try {
			log(`Extracting archive ${zip} → ${destination}`)
			new AdmZip(zip).extractAllTo(destination, true)
			dim('...done')
			resolve(true)
		}
		catch(e) {
			error(e)
			reject(false)
		}
	})
})

export default extractZip