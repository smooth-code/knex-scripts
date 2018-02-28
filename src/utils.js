import { readFile, readdir, exists } from 'mz/fs'

export async function getInsertsFromMigrations(migrationsPath) {
  if (!await exists(migrationsPath)) return []
  const migrations = await readdir(migrationsPath)
  return migrations.map(
    migration =>
      `INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('${migration}', 1, NOW());`,
  )
}

export async function getInsertsFromStructure(structurePath) {
  if (!await exists(structurePath)) return []
  const structure = await readFile(structurePath, 'utf-8')
  const regExp = /INSERT INTO knex_migrations\(name, batch, migration_time\) VALUES \('.*', 1, NOW\(\)\);/g

  const inserts = []

  let match
  /* eslint-disable no-cond-assign */
  while ((match = regExp.exec(structure))) {
    inserts.push(match[0])
  }
  /* eslint-enable no-cond-assign */

  return inserts
}

export function preventEnv(preventedEnv, env) {
  if (env === preventedEnv) {
    throw new Error(`Not in ${preventedEnv} please!`)
  }
}

export function requireEnv(requiredEnv, env) {
  if (env !== requiredEnv) {
    throw new Error(`Only in ${requiredEnv} please!`)
  }
}

export function wrapDockerCommand(options, command) {
  if (options.docker) {
    return `docker-compose run ${options.dockerService} ${command}`
  }

  return command
}

export function getCommandEnv({ knexConfig: { connection } }) {
  if (connection.password) {
    return {
      ...process.env,
      PGPASSWORD: connection.password,
    }
  }

  return process.env
}

export function getCommand({ docker, knexConfig: { connection } }, command) {
  const args = [command]

  if (docker) {
    args.push('--host postgres')
  } else if (connection.host) {
    args.push(`--host "${connection.host}"`)
  }

  if (connection.user) {
    args.push(`--username "${connection.user}"`)
  }

  if (connection.password) {
    args.push('--no-password')
  }

  args.push(connection.database)

  return args.join(' ')
}
