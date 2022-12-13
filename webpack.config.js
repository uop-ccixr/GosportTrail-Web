const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs'),
  },
  performance: {
    maxEntrypointSize: 4096000,
    maxAssetSize: 4096000
  }
};