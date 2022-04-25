import { curry } from "ramda"
import AdmZip from "adm-zip"

export const extractZip = curry((zip: string, destination: string) => {
	return new Promise((resolve, reject) => {
		try {
			new AdmZip(zip).extractAllTo(destination, true)
			resolve(true)
		}
		catch(e) {
			console.log(e)
			reject(false)
		}
	})
})

export default extractZip