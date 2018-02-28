import {
  requireEnv,
  getInsertsFromMigrations,
  getInsertsFromStructure,
} from './utils'

async function checkStructure(options) {
  const { structurePath, migrationsPath } = options
  requireEnv('development', options.env)

  const migrationsInFolder = await getInsertsFromMigrations(migrationsPath)
  const migrationsInStructure = await getInsertsFromStructure(structurePath)

  return migrationsInFolder.every(
    (insert, index) => migrationsInStructure[index] === insert,
  )
}

export default checkStructure
