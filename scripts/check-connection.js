
import { sequelize } from "@connector/db";
import { sleep } from "utils/promise-wraper";

async function checkDB() {
  try {
    await sequelize.authenticate()
    console.log('Connection to database has been established successfully.');

    return true
  } catch (error) {
    console.error('Unable to connect to the database:', err);
    return false
  }
}

main()
async function main() {
  console.log('Try connect to all services');
  let dbOk = false
  for (let index = 1; index < 11; index++) {
    if (!dbOk)
      dbOk = await checkDB()

    if (dbOk)
      break

    await sleep(3000)
    console.log(`Try time: ${index}`);
  }

  console.log('Conection to all services is OK');
}
