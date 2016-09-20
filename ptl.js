const parser = require('./lib/ptl-parser');

module.exports = function(text, context) {
    return parser.parse(text, context);
}