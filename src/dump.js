import { exec } from 'mz/child_process'
import { appendFile, readdir, exists } from 'mz/fs'
import { dirname } from 'path'
import mkdirp from 'mkdirp'
import {
  requireEnv,
  wrapDockerCommand,
  getCommand,
  getCommandEnv,
} from './utils'

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

async function dump(options) {
  const { structurePath, migrationsPath } = options
  requireEnv('development', options.env)

  mkdirp.sync(dirname(structurePath))

  const env = getCommandEnv(options)
  const command = `${getCommand(
    options,
    'pg_dump --schema-only',
  )} > ${structurePath}`

  await exec(wrapDockerCommand(options, command), { env })

  const migrationInserts = await getMigrationInserts({ migrationsPath })
  return appendFile(structurePath, `-- Knex migrations\n\n${migrationInserts}`)
}

export default dump
