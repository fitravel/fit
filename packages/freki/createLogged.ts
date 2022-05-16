import logger from "./logger"

export const createLogged = (fn: Function, msg: (...i: any[]) => string) => {
	return (...args: any[]) => {
		const { log, dimEcho, error } = logger()
		log(msg(...args))
		return fn(...args).catch(error).then(dimEcho('...done'))
	}
}

export default createLogged