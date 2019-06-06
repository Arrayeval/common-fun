const path = require("path")
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'evelUtils',
    libraryTarget: 'umd'
  }
}