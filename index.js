const { need, system } = require('pkg-fetch')
const nanoprocess = require('nanoprocess')
const assert = require('assert')
const semver = require('semver')
const path = require('path')
const pify = require('pify')
const fs = require('fs')

/**
 * Starts a patched Node process downloaded and built
 * by `pkg-fetch`
 * @param {?(Object)} opts
 * @return {Process}
 */
async function start(opts) {
  if (null === opts || 'object' !== typeof opts) {
    opts = {}
  } else {
    opts = Object.assign({}, opts) // copy
  }

  // the semantic version of Node for "this" process or one
  // supplied by the caller
  if (!opts.nodeRange) {
    const version = normalizeVersion(opts.version || process.version)
    const { major } = semver.parse(version)
    opts.nodeRange = `node${major}`
  }

  // the platform target of Node for "this" process or one
  // supplied by the caller
  if (!opts.platform) {
    opts.platform = system.toFancyPlatform(process.platform)
  }

  // the arch target of Node for "this" process or one
  // supplied by the caller
  if (!opts.arch) {
    opts.arch = system.toFancyArch(opts.arch || system.hostArch)
  }

  if (!opts.args) {
    opts.args = []
  }

  // download/build and return executable path
  let bin = null
  try {
    bin = await need(opts)
  } catch (err) {
    process.exit(1)
    return null
  }

  assert(bin && 'string' === typeof bin, 'Node binary path not resolved.')
  await pify(fs.access)(bin)
  await pify(fs.chmod)(bin, 448)

  const args = opts.args.slice()
  if (args.length && '-' !== args[0][0]) {
    args[0] = path.resolve(args[0])
  }

  delete opts.args

  // create child process and wait for open
  const child = nanoprocess(bin, args, {
    stdio: 'inherit',
    cwd: opts.cwd || process.cwd(),
    env: opts.env || process.env,
  })

  await pify((done) => child.open(done))()

  return child
}

/**
 * Normalizes a `version` input into a
 * "semantic version" string.
 * @private
 * @param {Mixed} version
 * @return {String}
 */
function normalizeVersion(version) {
  const normal = '0.0.0'.split('.')
  const parts = String(version).split('.')
  Object.assign(normal, parts)
  return semver.clean(normal.join('.'), { loose: true })
}

/**
 * Module exports.
 */
module.exports = {
  start
}
