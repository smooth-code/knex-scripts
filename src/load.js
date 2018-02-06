/* eslint-disable max-len */
import { exec } from 'mz/child_process'
import { preventEnv } from './utils'

async function load({ env, docker, structurePath, knexConfig }) {
  preventEnv('production', env)

  const command = docker
    ? `docker exec -i \`docker-compose ps -q postgres\` psql --username ${
        knexConfig.connection.user
      } ${knexConfig.connection.database} < ${structurePath}`
    : `psql --username ${knexConfig.connection.user} ${
        knexConfig.connection.database
      } < ${structurePath}`

  return exec(command)
}

export default load
