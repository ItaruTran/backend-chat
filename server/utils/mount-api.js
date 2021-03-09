'use strict';
const fs = require('fs');

module.exports = (Module, path) => {
  fs.readdirSync(`${__dirname}/../${path}`).forEach(file => {
    if (file.endsWith('.js'))
      require(`${__dirname}/../${path}/${file}`)(Module)
  })
}
