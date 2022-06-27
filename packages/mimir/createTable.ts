

export async function createTable (db, table: string) {
	const where = (query: R) => {
		const AND = join(' AND ')
		const toString = ([ key, i ]: [string, any]) => {
			const value = (i: any, operator: string = '='): string => {
				if (is(String)(i)) return `${operator}'${i}'`
				if (is(Object)(i)) return compose(AND, map(([ x, y ]) => i + value(y, x)), toPairs)(i)
				return `${operator}${i}`
			}
			return key + value(i)
		}
		return isEmpty(query) ? '' : ' WHERE ' + compose(AND, map(toString), toPairs)(query)
	}
	const fieldKeys = (keys?: string[]) => keys ?? false ? join(', ')(keys) : '*'

	const select = (query: R, fields?: string[]) => {
		return db.query(`SELECT ${fieldKeys(fields)} FROM ${table}${where(query)}`)
	}
	const insert = (data: R) => {
		const fields       = o(join(', '), keys)(data)
		const placeholders = o(join(', '), repeat('?'))(keys(data))
		return db.query(`INSERT INTO ${table} (${fields}) VALUES (${placeholders})`, values(data))
	}
	const update = (query: R, data: R) => {
		const fields = o(join(', '), map(i => `${i}=?`))(keys(data))
		return db.query(`UPDATE ${table} SET ${fields}${where(query)}`, values(data))
	}

	return { select, insert, update }
}

export default createTable