const KNEX_TABLES = ['knex_migrations', 'knex_migrations_lock']

let truncateQuery
async function getTruncateQuery(knex) {
  if (!truncateQuery) {
    const result = await knex.schema.raw(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'",
    )

    const tables = result.rows.reduce(
      (_tables, { tablename }) =>
        KNEX_TABLES.includes(tablename) ? _tables : [..._tables, tablename],
      [],
    )

    const disableTriggers = tables.map(
      table => `ALTER TABLE ${table} DISABLE TRIGGER ALL`,
    )
    const deletes = tables.map(table => `DELETE FROM ${table}`)
    const enableTriggers = tables.map(
      table => `ALTER TABLE ${table} ENABLE TRIGGER ALL`,
    )
    truncateQuery = [...disableTriggers, ...deletes, ...enableTriggers].join(
      ';',
    )
  }

  return truncateQuery
}

async function truncate({ getKnex }) {
  const knex = getKnex()
  const query = await getTruncateQuery(knex)
  await knex.schema.raw(query)
  knex.destroy()
}

export default truncate
