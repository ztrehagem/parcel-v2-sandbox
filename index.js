const { default: Parcel } = require('@parcel/core')
const { NodePackageManager } = require('@parcel/package-manager')
const { NodeFS } = require('@parcel/fs')
const globby = require('globby')

;(async () => {
  const entries = globby.sync(['**/*.pug', '!**/@(_*)/**', '!_*'], { cwd: './src' }).map((entry) => `src/${entry}`)
  console.log(entries)

  const packageManager = new NodePackageManager(new NodeFS())
  const defaultConfig = await packageManager.require('@parcel/config-default', __filename)

  const parcel = new Parcel({
    entries,
    packageManager,
    defaultConfig: {
      ...defaultConfig,
      filePath: defaultConfig.resolved,
    },
    patchConsole: true,
    disableCache: true,
    mode: 'production',
    minify: false,
    publicUrl: '/base/',
    distDir: 'dist',
    autoinstall: false,
    env: {
      NODE_ENV: 'production',
    },
  })

  await parcel.run()
})()
