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

export function getCommandEnv(options) {
  if (options.knexConfig.password) {
    return {
      ...process.env,
      PGPASSWORD: options.knexConfig.password,
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
