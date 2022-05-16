import { format } from "date-fns"

export const dashDate = (d: Date|string) => format(new Date(d), 'yyyy-MM-dd')

export default dashDate