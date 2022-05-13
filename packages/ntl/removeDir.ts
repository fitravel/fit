import rimraf from "rimraf"

export async function removeDir (path: string): Promise<boolean> {
	console.log(`Removing dir ${path}`)
	return new Promise<boolean>((resolve, reject) => {
		rimraf(path, (error: any) => {
			if (error) reject(false)
			console.log(`Write successful: Dir ${path} has been removed`)
			resolve(true)
		})
	})
}

export default removeDir