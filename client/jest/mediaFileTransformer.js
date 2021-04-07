// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

// eslint-disable-next-line no-undef
module.exports = { process: (_, filename) => `module.exports = '${JSON.stringify(path.basename(filename))}';` }
