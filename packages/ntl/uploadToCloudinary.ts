import { type UploadApiOptions, v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from "cloudinary"
import { isNil, isExt, echo } from "fn"

type CloudinaryUploadResponse = UploadApiErrorResponse|UploadApiResponse|undefined
type R = CloudinaryUploadResponse

export { type CloudinaryUploadResponse, type UploadApiResponse, type UploadApiErrorResponse }

export function uploadToCloudinary (path: string, _options: UploadApiOptions = {}): Promise<R> {
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
		console.log(`Attempting to upload file ${path} to Cloudinary`)
		cloudinary.uploader.upload(path, options, (error, response) => {
			if (!isNil(error) || isNil(response)) reject(error)
			console.log(`Upload successful: ${path} has been added to Cloudinary`)
			resolve(response as UploadApiResponse)
		})
	})
}

export default uploadToCloudinary