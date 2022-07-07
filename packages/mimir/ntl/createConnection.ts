import mariadb from "mariadb"

const host           = 'dox.cyt9y0dbi3wv.eu-west-1.rds.amazonaws.com'
const user           = 'admin'
const password       = 'CovidSokkar2021!'
const connectTimeout = 10000

export const createConnection = (database: string) => mariadb.createConnection({ database, host, user, password, connectTimeout })

export default createConnection