function excludeCondition(path) {
  const nonEs5SyntaxPackages = ['@solana'];

  // DO transpile these packages
  if (nonEs5SyntaxPackages.some(pkg => path.toString().indexOf(pkg)) > -1) {
    console.log('\n Will transpile - ' + path);
    return false;
  }

  // Ignore all other modules that are in node_modules
  if (path.toString().replace(__dirname, '').startsWith('/node_modules')) {
    console.log('\n Will not transpile - ' + path);
    return true;
  } else {
    console.log('\n Will transpile - ' + path);
    return false;
  }
}

module.exports = {
  exclude: excludeCondition,
  presets: [
    ['@babel/preset-env', { forceAllTransforms: true }],
    ['@vue/cli-plugin-babel/preset', { useBuiltIns: false }]
  ]
};
