import { Pool } from 'pg';
import { DATABASE_URL } from './constants';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export default pool;
