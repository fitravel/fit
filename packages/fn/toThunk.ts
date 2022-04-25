export const toThunk = (fn: Function) => (...args: any[]) => () => fn(...args)

export default toThunk