import { type UploadApiOptions, v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from "cloudinary"
import { isNil, isExt, echo } from "geri"
import { logger } from "./logger"

type CloudinaryUploadResponse = UploadApiErrorResponse|UploadApiResponse|undefined
type R = CloudinaryUploadResponse

export { type CloudinaryUploadResponse, type UploadApiResponse, type UploadApiErrorResponse }

export function uploadToCloudinary (path: string, _options: UploadApiOptions = {}): Promise<R> {
	const { log, dim, error } = logger()
	const options = {
		cloud_name: 'fitravel',
		api_key: '634512946275931',
		api_secret: '_clSiClQ4khoaY5VLqoslOXhdcQ',
		secure: true,
		resource_type: isExt('mp4')(path) ? 'video' : 'image',
		transformation: {
			quality: 'jpegmini'
		},
		..._options
	}
	return new Promise((resolve, reject) => {
		log(`Uploading file ${path} to Cloudinary`)
		cloudinary.uploader.upload(path, options, (e, response) => {
			if (!isNil(e) || isNil(response)) {
				error(e)
				reject(e)
			}
			dim(`...done`)
			resolve(response as UploadApiResponse)
		})
	})
}

export default uploadToCloudinary