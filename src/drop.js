/* eslint-disable max-len */
import { exec } from 'mz/child_process'
import {
  preventEnv,
  wrapDockerCommand,
  getCommand,
  getCommandEnv,
} from './utils'

async function create(options) {
  preventEnv('production', options.env)

  const env = getCommandEnv(options)
  const command = getCommand(options, 'dropdb --if-exists')
  return exec(wrapDockerCommand(options, command), { env })
}

export default create
