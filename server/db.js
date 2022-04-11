import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const devConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  post: process.env.PG_PORT,
}

const proConfig = {
  connectionString: process.env.PRODUCTION_DATABASE_URL, //heroku addons
  ssl: {
    rejectUnauthorized: false,
  },
}

const pool = new Pool(
  process.env.NODE_ENV === 'production' ? proConfig : devConfig
)

export default pool
