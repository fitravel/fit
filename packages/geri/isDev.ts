export const isDev = () => !!(process?.env?.DEV ?? null)

export default isDev