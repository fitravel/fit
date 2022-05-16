import { createConnection } from "mariadb"
import type { ConnectionConfig } from "mariadb"
import { toUpper, curry, join, compose, map, trim, o, repeat, isNil, flatten, 
	reject, isEmpty, startsWith, replace, toPairs, omit, keys, values, is, head } from "ramda"
	
type AnyData = Record<string, any>

export async function useDox (): Promise<Record<string, any>> {
	const c = await createConnection({
		database: 'hermes',
		host: 'dox.cyt9y0dbi3wv.eu-west-1.rds.amazonaws.com',
		user: 'admin',
		password: 'CovidSokkar2021!',
		connectTimeout: 10000
	})
	function boont (n: number) {
		return +n > 0 ? true : false
	}
	function inool (b: boolean) {
		return b ? 1 : 0
	}
	const nilf = curry((key: string, value: string|undefined) => isNil(value) ? '' : `${key}='${value}'`)
	function andIf (i: AnyData) {
		return o<AnyData, [string, string|undefined][], string[]>(map(([key, value]) => nilf(key)(value)), toPairs)(i)
	}
	function nullify (a: any[]) {
		return map(i => isNil(i) ? null : i)(a)
	}
	function fieldKeys (...fieldNames: (string[]|string)[]) {
		return `${join(', ')(flatten(fieldNames))}`
	}
	function fieldValues (...fieldNames: (string[]|string)[]) {
		return `(${fieldKeys(...fieldNames)}) VALUES (${o(join(','), repeat('?'))(flatten(fieldNames).length)})`
	}
	type WhereArgStrings = string[]|string
	type WhereArgData = AnyData[]|AnyData
	type WhereArgs = WhereArgData|WhereArgStrings

	function where (...a: WhereArgs[]) {
		const fn: (a: WhereArgs[]) => string = compose(
			join(' AND '), 
			reject(isEmpty),
			map((i: string) => startsWith('AND')(toUpper(i)) ? o(trim, replace(/AND/i, ''))(i) : i),
			map(trim),
			flatten,
			map((i: WhereArgs) => (
				is(Object)(i) && !Array.isArray(i) ? andIf(i as AnyData) : i
			)) as (a: WhereArgs[]) => WhereArgStrings[]
		)
		return isEmpty(a) ? '' : ` WHERE ${fn(flatten(a))}`
	}

	interface SelectOptions extends ConnectionConfig {
		fields: string[]|string;
		table: string;
		query: WhereArgs|WhereArgs[];
	}
	function select (i: SelectOptions) {
		const fields = isNil(i?.fields) ? '*' : (Array.isArray(i.fields) ? fieldKeys(...i.fields) : i.fields)
		const query  = isNil(i?.query) ? '' : `${Array.isArray(i.query) ? where(...i.query) : where(i.query)}`
		const config = omit([ 'fields', 'table', 'query' ])(i)
		const sql    = `SELECT ${fields} FROM ${i.table}${query}`

		return c.query({ ...config, sql })
	}

	interface InsertOptions extends ConnectionConfig {
		fields: AnyData;
		table: string;
	}
	function insert (i: InsertOptions) {
		const fields    = fieldValues(...keys(i.fields) as string[])
		const variables = nullify(values(i.fields))
		const config    = omit([ 'fields', 'table' ])(i)
		const sql       = `INSERT INTO ${i.table} ${fields}`

		return c.query({ ...config, sql }, variables)
	}

	interface UpdateOptions extends ConnectionConfig {
		fields: AnyData;
		table: string;
		query: WhereArgs|WhereArgs[];
	}
	function update (i: UpdateOptions) {
		const fields    = compose<AnyData, string[], string[], string>(join(', '), map((key: string) => `${key} = ?`), keys)(i.fields)
		const variables = nullify(values(i.fields))
		const query     = isNil(i.query) ? '' : `${Array.isArray(i.query) ? where(...i.query) : where(i.query)}`
		const config    = omit([ 'fields', 'table', 'query' ])(i)
		const sql       = `UPDATE ${i.table} SET ${fields}${query}`

		return c.query({ ...config, sql }, variables)
	}

	//

	interface ToggleOptions extends ConnectionConfig {
		field: string;
		table: string;
		query: WhereArgs|WhereArgs[];
	}
	function createToggle (i: ToggleOptions) {
		return (b: boolean|number) => update({ ...i, fields: { [i.field]: inool(b as boolean) } })
	}

	//

	function createSelect ({ fields, model, table }: AnyData) {
		return async (query: AnyData) => {
			return map(model)(await select({ fields, query, table })) as AnyData[]
		}
	}
	function onlyOne (fn: (i: AnyData) => Promise<AnyData[]>) {
		return async (query: AnyData) => {
			return head(await fn(query)) ?? null
		}
	}
	function createInsert ({ table }: AnyData) {
		return async (fields: AnyData) => {
			return await insert({ fields, table })
		}
	}
	function createUpdate ({ table }: AnyData) {
		return curry(async (query: AnyData, fields: AnyData) => {
			return await update({ fields, query, table })
		})
	}
	function createAPI ({ key, fields, table, model }: AnyData) {
		const selectFn = createSelect({ fields, model, table })
		const insertFn = createInsert({ table })
		const updateFn = createUpdate({ table })

		return {
			[`get${key}s`]: selectFn,
			[`get${key}`]: onlyOne(selectFn),
			[`add${key}`]: insertFn,
			[`update${key}`]: updateFn
		}
	}

	//
	
	const USERS = createAPI({
		key: 'User',
		fields: [ 'id', 'email', 'name', 'is_active', 'created', 'last_login', 'last_modified', 'is_sales', 'is_marketing', 'is_admin' ],
		model: ({ id, email, name, created, last_login, last_modified, is_active, is_admin, is_sales, is_marketing }: AnyData) => ({ 
			id, email, name, created, lastLogin: last_login, lastModified: last_modified, isActive: boont(is_active),
			roles: { isAdmin: boont(is_admin), isSales: boont(is_sales), isMarketing: boont(is_marketing) }
		}),
		table: 'janus_users'
	})
	const AUTH = createAPI({
		key: 'Auth',
		fields: [ 'id', 'token', 'lock_id', 'user', 'is_confirmed', 'is_active', 'created' ],
		model: ({ id, token, lock_id, user, is_confirmed, is_active, created }: AnyData) => ({ 
			id, token, lock: lock_id, user, created, isConfirmed: boont(is_confirmed), isActive: boont(is_active) 
		}),
		table: 'janus_auths'
	})
	const STATQUERY = createAPI({
		key: 'StatQuery',
		fields: [ 'id', 'token', 'isReady', 'results' ],
		model: ({ id, token, isReady, results }: AnyData) => ({
			id, token, isReady: boont(isReady), results: JSON.parse(results)
		}),
		table: 'bruce_queries'
	})

	return { 
		...c, select, insert, update, 
		createToggle, nilf, andIf, boont, inool,
		...USERS, ...AUTH, ...STATQUERY
	}
}