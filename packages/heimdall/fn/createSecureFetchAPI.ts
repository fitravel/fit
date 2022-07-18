import { createSecureFetch } from "./createSecureFetch"
import { type CreateFetchApiOptions, createFetchAPI } from "mimir"

export const createSecureFetchAPI = (options: CreateFetchApiOptions) => {
	return createFetchAPI({ fetchFactory: createSecureFetch, ...options })
}

export default createSecureFetchAPI