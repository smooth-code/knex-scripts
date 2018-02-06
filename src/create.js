/* eslint-disable max-len */
import { exec } from 'mz/child_process'
import { preventEnv } from './utils'

async function create({ docker, env, knexConfig }) {
  preventEnv('production', env)

  const command = docker
    ? `docker-compose run postgres createdb --host postgres --username ${
        knexConfig.connection.user
      } ${knexConfig.connection.database}`
    : `createdb --username ${knexConfig.connection.user} ${
        knexConfig.connection.database
      }`

  return exec(command)
}

export default create
