export const strif = (i: any, s: string|((i?: any) => string)) => (i ?? null) ? s : ''

export default strif