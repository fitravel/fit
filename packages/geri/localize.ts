import { format } from 'date-fns'
import locale from 'date-fns/locale/is'

export function localize (date: Date, ISO: string) {
	return format(date, ISO, { locale })
}

export default localize