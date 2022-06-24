import { format } from 'date-fns'
import locale from 'date-fns/locale/is'

export function localize (date: Date|string, ISO: string) {
	return format(new Date(date), ISO, { locale })
}

export default localize