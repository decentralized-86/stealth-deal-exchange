const path = require('path')
 
const buildEslintCommand = (_filenames) => 'next lint --fix'
 
module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
