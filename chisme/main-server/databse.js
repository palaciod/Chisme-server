import pg from "pg";
const Pool = pg.Pool;

const pool = new Pool({
  host: "localhost",
  port: 6000,
  database: "chisme"
});

export default pool;