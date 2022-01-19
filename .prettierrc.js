module.exports = {
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  files: '**/*.{js, ts, css, scss, md, vue, json}',
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue'
      }
    }
  ]
};
