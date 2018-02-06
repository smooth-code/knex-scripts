/* eslint-disable global-require */
const config = {
  development: {
    client: 'postgresql',
    connection: {
      user: 'postgres',
      database: 'development',
      timezone: 'utc',
    },
  },
}

module.exports = config
