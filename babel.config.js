module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-proposal-optional-catch-binding',
    ['transform-class-properties', { spec: true }],
    '@babel/plugin-proposal-optional-chaining',
    'transform-function-bind',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-throw-expressions',
    [
      'module-resolver',
      {
        alias: {
          '@src': './src',
        }
      }
    ],

    // minify
    'transform-remove-console',
    'babel-plugin-transform-remove-undefined',
    'transform-remove-debugger'
  ]
};
