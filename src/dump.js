import { exec } from 'mz/child_process'
import { appendFile, readdir, exists } from 'mz/fs'
import { dirname } from 'path'
import mkdirp from 'mkdirp'
import { requireEnv } from './utils'

async function getMigrationInserts({ migrationsPath }) {
  if (!await exists(migrationsPath)) return ''
  const migrations = await readdir(migrationsPath)
  return migrations
    .map(
      migration =>
        `INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('${migration}', 1, NOW());\n`,
    )
    .join('')
}

async function dump({
  docker,
  env,
  structurePath,
  migrationsPath,
  knexConfig,
}) {
  requireEnv('development', env)

  mkdirp.sync(dirname(structurePath))

  const command = docker
    ? `docker-compose exec postgres pg_dump --schema-only --username ${
        knexConfig.connection.user
      } ${knexConfig.connection.database} > ${structurePath}`
    : `pg_dump --schema-only --username ${knexConfig.connection.user} ${
        knexConfig.connection.database
      } > ${structurePath}`

  await exec(command)
  const migrationInserts = await getMigrationInserts({ migrationsPath })
  return appendFile(structurePath, `-- Knex migrations\n\n${migrationInserts}`)
}

export default dump
