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
