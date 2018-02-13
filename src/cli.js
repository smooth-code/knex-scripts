/* eslint-disable no-console, global-require, import/no-dynamic-require */
import Liftoff from 'liftoff'
import v8flags from 'v8flags'
import { jsVariants } from 'interpret'
import commander from 'commander'
import chalk from 'chalk'
import tildify from 'tildify'
import minimist from 'minimist'
import { join } from 'path'
import cliPkg from '../package.json'
import create from './create'
import drop from './drop'
import dump from './dump'
import load from './load'
import truncate from './truncate'

const argv = minimist(process.argv.slice(2))

function exit(text) {
  if (text instanceof Error) {
    console.error(chalk.red(text.stack))
  } else {
    console.error(chalk.red(text))
  }
  process.exit(1)
}

const cli = new Liftoff({
  name: 'knex',
  extensions: jsVariants,
  v8flags,
})

function checkLocalModule(env) {
  if (!env.modulePath) {
    console.log(
      chalk.red('No local knex install found in:'),
      chalk.magenta(tildify(env.cwd)),
    )
    exit('Try running: npm install knex.')
  }
}

function initConfig(env) {
  checkLocalModule(env)

  if (!env.configPath) {
    exit('No knexfile found in this directory. Specify a path with --knexfile')
  }

  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd)
    console.log('Working directory changed to', chalk.magenta(tildify(env.cwd)))
  }

  const defaultEnv = 'development'
  let config = require(env.configPath)
  let environment = commander.env || process.env.NODE_ENV

  if (!environment && typeof config[defaultEnv] === 'object') {
    environment = defaultEnv
  }

  const knexScriptsConfig = config.knexScripts || {}

  if (environment) {
    console.log('Using environment:', chalk.magenta(environment))
    config = config[environment] || config
  }

  if (!config) {
    console.log(chalk.red('Warning: unable to read knexfile config'))
    process.exit(1)
  }

  if (argv.debug !== undefined) config.debug = argv.debug
  const knex = require(env.modulePath)
  return {
    getKnex: () => knex(config),
    knexConfig: config,
    env: environment,
    structurePath: knexScriptsConfig.structurePath || 'db/structure.sql',
    migrationsPath: join(process.cwd(), 'migrations'),
    docker:
      (commander.docker !== undefined
        ? commander.docker
        : knexScriptsConfig.docker) || false,
    dockerService:
      (commander.dockerService !== undefined
        ? commander.dockerService
        : knexScriptsConfig.dockerService) || 'postgres',
  }
}

function invoke(env) {
  commander
    .version(
      chalk`{blue Knex Scripts version: {green ${cliPkg.version}}}\n` +
        chalk`{blue Knex version: {green ${env.modulePackage.version}}}\n`,
    )
    .option('--docker', 'Use docker.')
    .option(
      '--docker-service [service]',
      'Docker service name, default: "postgres".',
    )
    .option('--knexfile [path]', 'Specify the knexfile path.')
    .option('--cwd [path]', 'Specify the working directory.')
    .option(
      '--env [name]',
      'environment, default: process.env.NODE_ENV || development',
    )

  commander
    .command('create')
    .description('Create database.')
    .action(() => {
      const config = initConfig(env)
      return create(config)
        .then(() => console.log(chalk.green(`Database created.`)))
        .catch(exit)
    })

  commander
    .command('drop')
    .description('Drop database.')
    .action(() => {
      const config = initConfig(env)
      return drop(config)
        .then(() => console.log(chalk.green(`Database dropped.`)))
        .catch(exit)
    })

  commander
    .command('dump')
    .description('Dump database.')
    .action(() => {
      const config = initConfig(env)
      return dump(config)
        .then(() => console.log(chalk.green(`Dump created.`)))
        .catch(exit)
    })

  commander
    .command('load')
    .description('Load database.')
    .action(() => {
      const config = initConfig(env)
      return load(config)
        .then(() => console.log(chalk.green(`Database loaded.`)))
        .catch(exit)
    })

  commander
    .command('truncate')
    .description('Truncate all tables.')
    .action(() => {
      const config = initConfig(env)
      return truncate(config)
        .then(() => console.log(chalk.green(`Database truncated.`)))
        .catch(exit)
    })

  commander.parse(process.argv)
}

cli.launch(
  {
    cwd: argv.cwd,
    configPath: argv.knexfile,
    require: argv.require,
    completion: argv.completion,
  },
  invoke,
)
