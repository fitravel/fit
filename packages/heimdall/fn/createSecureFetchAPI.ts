import { createSecureFetch } from "./createSecureFetch"
import { type CreateFetchApiOptions, createFetchAPI } from "mimir"
import { type R } from "geri"

export const createSecureFetchAPI = <T = R>(options: CreateFetchApiOptions) => {
	return createFetchAPI<T>({ fetchFactory: createSecureFetch, ...options })
}

export default createSecureFetchAPI