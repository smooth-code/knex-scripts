# Knex Scripts

[![Build Status](https://travis-ci.org/smooth-code/knex-scripts.svg?branch=master)](https://travis-ci.org/smooth-code/knex-scripts)

Knex utilities to interact with Postgres database.

```
npm install knex-scripts
```

## Command Line Usage

```
  Usage: cli [options] [command]


  Options:

  -V, --version               output the version number
  --docker                    Use docker.
  --docker-service [service]  Docker service name, default: "postgres".
  --knexfile [path]           Specify the knexfile path.
  --cwd [path]                Specify the working directory.
  --env [name]                environment, default: process.env.NODE_ENV || development
  -h, --help                  output usage information


  Commands:

  create           Create database.
  drop             Drop database.
  dump             Dump database.
  load             Load database.
  check-structure  Check structure.
  truncate         Truncate all tables.
```

## Node API Usage

```js
import knex from 'knex'
import { truncate } from 'knex-scripts'
import config from './knexfile'

// Truncate all database
truncate({ getKnex: () => knex(config) })
  .then(() => console.log('Truncated'))
  .catch(console.error)
```

## Configuration

```js
// knexfile.js
const config = {
  knexScripts: {
    docker: false,
    structurePath: 'db/structure.sql',
  },
  development: {
    client: 'postgresql',
    connection: {
      user: 'postgres',
      database: 'development',
      timezone: 'utc',
    },
  },
}

module.exports = config
```

## License

MIT
