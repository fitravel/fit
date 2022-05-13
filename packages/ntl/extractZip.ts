import { curry } from "ramda"
import AdmZip from "adm-zip"

export const extractZip = curry((zip: string, destination: string) => {
	return new Promise((resolve, reject) => {
		try {
			console.log(`Extracting archive ${zip} into ${destination}`)
			new AdmZip(zip).extractAllTo(destination, true)
			console.log(`Write successful: Archive ${zip} has been extracted into ${destination}`)
			resolve(true)
		}
		catch(e) {
			console.error(e)
			reject(false)
		}
	})
})

export default extractZip