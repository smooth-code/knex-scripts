import { exec } from 'mz/child_process'
import { appendFile } from 'mz/fs'
import { dirname } from 'path'
import mkdirp from 'mkdirp'
import {
  requireEnv,
  wrapDockerCommand,
  getCommand,
  getCommandEnv,
  getInsertsFromMigrations,
} from './utils'

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

  const migrationInserts = await getInsertsFromMigrations(migrationsPath)
  return appendFile(
    structurePath,
    `-- Knex migrations\n\n${migrationInserts.join('\n')}`,
  )
}

export default dump
