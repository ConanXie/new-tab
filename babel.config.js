module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          browsers: [
            'chrome >= 69',
          ],
        },
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    [
      '@babel/plugin-proposal-decorators', {
        legacy: true,
      }
    ],
    [
      '@babel/plugin-proposal-class-properties', {
        loose: true,
      }
    ],
    'react-hot-loader/babel',
    "react-loadable/babel",
  ],
}
