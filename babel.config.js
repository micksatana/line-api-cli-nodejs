module.exports = {
  plugins: [],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '8'
        }
      }
    ]
  ],
  ignore: [
    'node_modules',
    'bin',
    'doc',
    'man',
    'babel.config.js',
    'coverage'
  ]
};
