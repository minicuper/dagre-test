const path = require('path')

module.exports = {
  moduleMode: true,
  apps: {
    main: path.join(__dirname, 'main')
  },
  backendApps: {
    server: path.join(__dirname, 'server')
  },
  addons: [
    'sharedb' // Plugs in racer-highway client-side scripts
  ],
  frontend: {
    // run with source=0 to completely turn the source maps off
    // (useful when you are testing through browserstack)
    devtool: process.env.source === '0'
      ? false
      : process.env.source
      ? 'source-map'
      : 'cheap-module-eval-source-map',
    classPrefix: true
  },
  backend: {
    devtool: 'source-map',
    uglify: false
  },
  resolve: {
    alias: {
      '~': __dirname,
      'icons': path.resolve('./main/styles/icons')
    }
  },
  stylus: {
    import: [
    ]
  },
  webpackPort: process.env.DEVSERVER_PORT || 3010
}
