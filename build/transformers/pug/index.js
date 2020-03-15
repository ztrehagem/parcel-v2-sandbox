const path = require('path')
const { Transformer } = require('@parcel/plugin')

exports.default = new Transformer({
  async getConfig({asset}) {
    const config = await asset.getConfig([
      '.pugrc',
      '.pugrc.js',
      'pug.config.js',
    ]);
    return config || {};
  },

  async transform({asset, config, options}) {
    if (!config) {
      return [asset];
    }

    const pug = await options.packageManager.require('pug', asset.filePath);
    const content = await asset.getCode();
    const render = pug.compile(content, {
      debug: false,
      compileDebug: false,
      basedir: config.basedir ? path.resolve(config.basedir) : path.dirname(asset.filePath),
      filename: asset.filePath,
      pretty: config.pretty || false,
      doctype: config.doctype,
      filters: config.filters,
      filterOptions: config.filterOptions,
      filterAliases: config.filterAliases,
    });

    for (let filePath of render.dependencies) {
      await asset.addIncludedFile({filePath});
    }

    asset.type = 'html';
    asset.setCode(render(config.locals));

    return [asset];
  },
});
