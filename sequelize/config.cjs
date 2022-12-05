
module.exports = async function () {
  const { stage, postgresql } = await import('#sv/env.js')
  return {
    [stage]: {
      username: postgresql.user,
      password: postgresql.password,
      port: postgresql.port,
      database: postgresql.database,
      host: postgresql.host,
      dialect: 'postgres',
    }
  }
}
