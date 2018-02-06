import { exec } from 'mz/child_process'
import { preventEnv } from './utils'

async function drop({ docker, env, knexConfig }) {
  preventEnv('production', env)

  const command = docker
    ? `docker-compose run postgres dropdb --host postgres --username ${
        knexConfig.connection.user
      } ${knexConfig.connection.database} --if-exists`
    : `dropdb --username ${knexConfig.connection.user} ${
        knexConfig.connection.database
      } --if-exists`

  return exec(command)
}

export default drop
