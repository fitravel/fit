export const importAs = <T = Record<string, any>>(i: string): Promise<T> => import(/* @vite-ignore */`${i}`) as Promise<T>

export default importAs