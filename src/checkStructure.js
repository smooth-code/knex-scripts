import { getInsertsFromMigrations, getInsertsFromStructure } from './utils'

async function checkStructure({ structurePath, migrationsPath }) {
  const migrationsInFolder = await getInsertsFromMigrations(migrationsPath)
  const migrationsInStructure = await getInsertsFromStructure(structurePath)

  return migrationsInFolder.every(
    (insert, index) => migrationsInStructure[index] === insert,
  )
}

export default checkStructure
