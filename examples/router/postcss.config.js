'use strict'

const autoprefixer = require('autoprefixer')
const postcssCssVariables = require('postcss-css-variables')
const postcssImport = require('postcss-import')
const postCssNested = require('postcss-nested')

module.exports = {
  plugins: [postcssImport, postCssNested, postcssCssVariables, autoprefixer]
}
