const path = require('path')
const { default: Parcel } = require('@parcel/core')
const { NodePackageManager } = require('@parcel/package-manager')
const { NodeFS } = require('@parcel/fs')
const globby = require('globby')

;(async () => {
  const srcDir = './src'

  const entries = globby
    .sync(['**/*.pug', '!**/@(_*)/**'], { cwd: srcDir })
    .map((entry) => path.join(srcDir, entry))
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
    mode: 'development',
    minify: false,
    sourceMaps: false,
    publicUrl: '/base/',
    distDir: 'dist',
    autoinstall: false,
    env: {
      NODE_ENV: 'development',
      minify: false,
    },
  })

  await parcel.run()
})()
