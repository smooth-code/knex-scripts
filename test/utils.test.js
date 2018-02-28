import path from 'path'
import { getInsertsFromMigrations, getInsertsFromStructure } from '../src/utils'

describe('#getInsertsFromMigrations', () => {
  it('without an existing directory, it should return an empty array', async () => {
    const inserts = await getInsertsFromMigrations(
      '/something-that-does-not-exist',
    )
    expect(inserts).toEqual([])
  })

  it('should read migrations from folder', async () => {
    const inserts = await getInsertsFromMigrations(
      path.join(__dirname, '__fixtures__/migrations'),
    )
    expect(inserts).toEqual([
      `INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('20180207153033_migration_1.js', 1, NOW());`,
      `INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('20180207153040_migration_2.js', 1, NOW());`,
    ])
  })
})

describe('#getInsertsFromStructure', () => {
  it('without an existing file, it should return an empty array', async () => {
    const inserts = await getInsertsFromStructure(
      '/something-that-does-not-exist',
    )
    expect(inserts).toEqual([])
  })

  it('should read migrations from structure', async () => {
    const inserts = await getInsertsFromStructure(
      path.join(__dirname, '__fixtures__/structure.sql'),
    )
    expect(inserts).toEqual([
      `INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('20180207153033_migration_1.js', 1, NOW());`,
      `INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('20180207153040_migration_2.js', 1, NOW());`,
      `INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('20180207153050_migration_3.js', 1, NOW());`,
    ])
  })
})
