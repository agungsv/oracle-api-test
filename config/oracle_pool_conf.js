const oracledb = require("oracledb");

async function init() {
  try {
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONN_STRING,
      poolIncrement: parseInt(process.env.DB_POOL_INCREMENT),
      poolMax: parseInt(process.env.DB_POOL_MAX),
      poolMin: parseInt(process.env.DB_POOL_MIN),
      poolTimeout: parseInt(process.env.DB_POOL_TIMEOUT)
    });
    console.log('Connection pool started');
  } catch (err) {
    console.log('Error creationg pool');
    console.log(err);
  }
};

async function closePoolAndExit() {
  console.log('Closing Pool');
  try {
    await oracledb.getPool().close(30);
    console.log('Pool closed');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);

init();

module.exports = oracledb;